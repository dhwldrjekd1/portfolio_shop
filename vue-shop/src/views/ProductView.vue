<template>
  <div class="products-page">
    <div class="container">
      <!-- ===== 페이지 헤더 ===== -->
      <div class="page-header">
        <h1 class="page-title">{{ pageTitle }}</h1>
        <p class="page-count">{{ filteredProducts.length }}개의 상품</p>
      </div>

      <div class="row g-4">
        <!-- ===== 왼쪽 필터 사이드바 ===== -->
        <div class="col-lg-3">
          <div class="filter-sidebar">
            <!-- 필터 헤더 -->
            <div class="filter-top">
              <span class="filter-label">FILTER</span>
              <button class="filter-reset" @click="resetFilters">초기화</button>
            </div>

            <!-- 카테고리 -->
            <div class="filter-group">
              <p class="filter-group-title">카테고리</p>
              <div class="d-flex flex-column gap-2">
                <label v-for="cat in store.categories" :key="cat.id" class="filter-radio">
                  <input
                    type="radio"
                    v-model="filters.category"
                    :value="cat.id"
                    class="form-check-input m-0"
                  />
                  <span>{{ cat.name }}</span>
                </label>
              </div>
            </div>

            <!-- 가격대 -->
            <div class="filter-group">
              <p class="filter-group-title">가격대</p>
              <input
                type="range"
                class="form-range"
                v-model="filters.maxPrice"
                min="0"
                max="400000"
                step="10000"
              />
              <div class="price-range-label">
                <span>0원</span>
                <span class="price-value">{{ filters.maxPrice.toLocaleString() }}원</span>
              </div>
            </div>

            <!-- 뱃지 -->
            <div class="filter-group">
              <p class="filter-group-title">뱃지</p>
              <div class="d-flex flex-wrap gap-2">
                <button
                  v-for="badge in [
                    'DISNEY × F1®',
                    '2025 BOLD',
                    '2025 FALL',
                    '2026 BOUQUET',
                    'BEST',
                    'NEW',
                    'SALE',
                  ]"
                  :key="badge"
                  class="badge-btn"
                  :class="{ active: filters.badge === badge }"
                  @click="filters.badge = filters.badge === badge ? '' : badge"
                >
                  {{ badge }}
                </button>
              </div>
            </div>

            <!-- 최소 평점 -->
            <div class="filter-group">
              <p class="filter-group-title">최소 평점</p>
              <div class="d-flex flex-wrap gap-2">
                <button
                  v-for="r in [3, 3.5, 4, 4.5, 5]"
                  :key="r"
                  class="badge-btn"
                  :class="{ active: filters.minRating === r }"
                  @click="filters.minRating = filters.minRating === r ? 0 : r"
                >
                  {{ r }}+ ★
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ===== 오른쪽 상품 그리드 ===== -->
        <div class="col-lg-9">
          <!-- 검색 + 정렬 -->
          <div class="grid-toolbar">
            <div class="search-wrap">
              <i class="bi bi-search"></i>
              <input
                type="text"
                v-model="filters.search"
                placeholder="상품 검색..."
                class="search-input"
              />
            </div>
            <select v-model="filters.sort" class="sort-select">
              <option value="default">기본 정렬</option>
              <option value="price-asc">가격 낮은 순</option>
              <option value="price-desc">가격 높은 순</option>
              <option value="rating">평점 높은 순</option>
            </select>
          </div>

          <!-- 로딩 중 -->
          <div v-if="store.loading" class="text-center py-5">
            <div class="spinner-border text-light" role="status"></div>
          </div>

          <!-- 검색 결과 없음 -->
          <div v-else-if="filteredProducts.length === 0" class="empty-state">
            <i class="bi bi-search fs-1 mb-3 d-block"></i>
            <p>검색 결과가 없습니다.</p>
            <button class="badge-btn mt-3" @click="resetFilters">필터 초기화</button>
          </div>

          <!-- 상품 그리드 -->
          <div v-else class="row g-3 g-lg-4">
            <div
              v-for="product in filteredProducts"
              :key="product.id"
              class="col-6 col-md-4"
            >
              <ProductCard :product="product" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useShopStore } from "@/store/shop";
import ProductCard from "@/components/ProductCard.vue";

const store = useShopStore();
const route = useRoute();

// ===== 필터 상태 =====
const filters = ref({
  category: "all", // 카테고리 필터 (all, sunglasses, eyeglasses)
  maxPrice: 400000, // 최대 가격 필터
  badge: "", // 뱃지 필터 (NEW, BEST 등)
  search: "", // 검색어
  minRating: 0, // 최소 평점 필터
  sort: "default", // 정렬 기준
});

// ===== URL 쿼리 파라미터로 필터 초기화 =====
// 헤더 카테고리 클릭 시 쿼리 파라미터 반영
onMounted(() => {
  // category 쿼리 없으면 'all' (전체) 유지
  filters.value.category = route.query.category || "all";
  if (route.query.search) filters.value.search = route.query.search;
  if (route.query.badge) filters.value.badge = route.query.badge;
  store.fetchData();
});

// ===== URL 쿼리 변경 감지 =====
// 헤더 메뉴 클릭 시 실시간 필터 업데이트
watch(
  () => route.query,
  (q) => {
    filters.value.category = q.category || "all"; // 쿼리 없으면 전체
    if (q.search) filters.value.search = q.search;
    if (q.badge) filters.value.badge = q.badge;
  },
  { deep: true }
);

// ===== 필터 적용된 상품 목록 =====
const filteredProducts = computed(() => {
  let list = [...store.products];

  // 카테고리 필터 (all이면 전체 표시)
  if (filters.value.category !== "all")
    list = list.filter((p) => p.category === filters.value.category);

  // 뱃지 필터 (대소문자 무시)
  if (filters.value.badge)
    list = list.filter(
      (p) => p.badge?.toLowerCase() === filters.value.badge.toLowerCase()
    );

  // 검색어 필터 (상품명, 설명 포함)
  if (filters.value.search) {
    const q = filters.value.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q)
    );
  }

  // 가격 필터 (최대 가격 이하)
  list = list.filter((p) => (p.price || 0) <= filters.value.maxPrice);

  // 평점 필터 (DB 리뷰 기반 avgRating 사용)
  if (filters.value.minRating > 0)
    list = list.filter((p) => (p.avgRating || 0) >= filters.value.minRating);

  // 정렬
  switch (filters.value.sort) {
    case "price-asc": // 가격 낮은 순
      return [...list].sort((a, b) => a.price - b.price);
    case "price-desc": // 가격 높은 순
      return [...list].sort((a, b) => b.price - a.price);
    case "rating": // 평점 높은 순
      return [...list].sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
    default:
      // 기본 정렬
      return list;
  }
});

// ===== 페이지 타이틀 =====
// 선택된 카테고리에 따라 타이틀 변경
const pageTitle = computed(() => {
  const cat = store.categories.find((c) => c.id === filters.value.category);
  return cat && cat.id !== "all" ? cat.name : "전체 상품";
});

// ===== 필터 초기화 =====
function resetFilters() {
  filters.value = {
    category: "all",
    maxPrice: 400000,
    badge: "",
    search: "",
    minRating: 0,
    sort: "default",
  };
}
</script>

<style scoped>
/* ===== 페이지 전체 ===== */
.products-page {
  padding: 48px 0 80px;
}

/* ===== 페이지 헤더 ===== */
.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-family: "Bebas Neue", sans-serif;
  font-size: 40px;
  letter-spacing: 0.08em;
  color: #f2f0eb;
  margin-bottom: 4px;
}

.page-count {
  font-size: 13px;
  color: #888;
  margin: 0;
}

/* ===== 필터 사이드바 ===== */
.filter-sidebar {
  background: #161616;
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 24px;
  position: sticky;
  top: 80px;
}

.filter-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.filter-label {
  font-size: 12px;
  letter-spacing: 0.2em;
  color: #f2f0eb;
}

.filter-reset {
  font-size: 12px;
  color: #888;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}

.filter-reset:hover {
  color: #f2f0eb;
}

/* 필터 그룹 */
.filter-group {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.filter-group:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.filter-group-title {
  font-size: 11px;
  letter-spacing: 0.15em;
  color: #888;
  margin-bottom: 12px;
  text-transform: uppercase;
}

/* 라디오 버튼 */
.filter-radio {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
  color: #aaa;
}

.filter-radio:hover {
  color: #f2f0eb;
}

.filter-radio input {
  accent-color: #b8a898;
}

/* 가격 범위 */
.price-range-label {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888;
  margin-top: 6px;
}

.price-value {
  color: #b8a898;
}

/* 뱃지 버튼 */
.badge-btn {
  padding: 5px 12px;
  font-size: 11px;
  letter-spacing: 0.1em;
  background: transparent;
  color: #888;
  border: 1px solid rgba(255, 255, 255, 0.12);
  cursor: pointer;
  transition: all 0.2s;
}

.badge-btn:hover,
.badge-btn.active {
  background: #f2f0eb;
  color: #0d0d0d;
  border-color: #f2f0eb;
}

/* ===== 툴바 (검색 + 정렬) ===== */
.grid-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

/* 검색 */
.search-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #161616;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 8px 14px;
  max-width: 260px;
  flex: 1;
}

.search-wrap i {
  color: #666;
  font-size: 13px;
}

.search-input {
  background: none;
  border: none;
  outline: none;
  color: #f2f0eb;
  font-size: 13px;
  font-family: "DM Sans", sans-serif;
  width: 100%;
}

.search-input::placeholder {
  color: #555;
}

/* 정렬 셀렉트 */
.sort-select {
  background: #161616;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #f2f0eb;
  font-size: 13px;
  font-family: "DM Sans", sans-serif;
  padding: 8px 12px;
  outline: none;
  cursor: pointer;
  max-width: 160px;
}

.sort-select option {
  background: #161616;
}

/* ===== 빈 상태 ===== */
.empty-state {
  text-align: center;
  padding: 80px 0;
  color: #666;
}

/* ===== 모바일 ===== */
@media (max-width: 768px) {
  .products-page {
    padding: 32px 0 60px;
  }

  .page-title {
    font-size: 28px;
  }

  .grid-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-wrap {
    max-width: 100%;
  }

  .sort-select {
    max-width: 100%;
  }
}
</style>
