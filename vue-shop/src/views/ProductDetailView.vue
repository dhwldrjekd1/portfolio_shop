<template>
  <div class="detail-page">
    <div class="container">

      <!-- ===== 브레드크럼 ===== -->
      <nav class="breadcrumb-nav">
        <RouterLink to="/">홈</RouterLink>
        <span>/</span>
        <RouterLink to="/products">상품</RouterLink>
        <span>/</span>
        <span class="breadcrumb-current">{{ product?.name }}</span>
      </nav>

      <!-- ===== 로딩 ===== -->
      <div v-if="store.loading" class="text-center py-5">
        <div class="spinner-border text-light" role="status"></div>
      </div>

      <!-- ===== 상품 없음 ===== -->
      <div v-else-if="!product" class="empty-state">
        <i class="bi bi-exclamation-circle"></i>
        <p>상품을 찾을 수 없습니다.</p>
        <RouterLink to="/products" class="detail-btn-outline">상품 목록으로</RouterLink>
      </div>

      <!-- ===== 상품 상세 ===== -->
      <template v-else>
        <div class="row g-5">

          <!-- 왼쪽: 이미지 -->
          <div class="col-md-6">

            <!-- 메인 이미지 -->
            <div class="main-img-wrap">
              <img :src="selectedImage" :alt="product.name" class="main-img" />

              <!-- 위시리스트 버튼 -->
              <button class="wish-btn" @click="store.toggleWishlist(product)">
                <i :class="isWishlisted ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
              </button>
            </div>

            <!-- 썸네일 -->
            <div class="thumb-list">
              <div
                v-for="(img, idx) in product.images"
                :key="idx"
                class="thumb-item"
                :class="{ active: selectedImage === img }"
                @click="selectedImage = img"
              >
                <img :src="img" :alt="`${product.name} ${idx + 1}`" />
              </div>
            </div>

          </div>

          <!-- 오른쪽: 상품 정보 -->
          <div class="col-md-6">

            <!-- 카테고리 -->
            <p class="detail-category">{{ categoryName }}</p>

            <!-- 상품명 -->
            <h1 class="detail-name">{{ product.name }}</h1>

            <!-- 평점 -->
            <div class="detail-rating">
              <div class="stars">
                <i
                  v-for="n in 5"
                  :key="n"
                  class="bi"
                  :class="n <= Math.round(product.rating) ? 'bi-star-fill' : 'bi-star'"
                ></i>
              </div>
              <span>{{ product.rating }}</span>
              <span class="review-count">({{ product.reviewCount }}개 리뷰)</span>
            </div>

            <!-- 가격 -->
            <div class="detail-price-wrap">
              <span class="detail-price">{{ formatPrice(product.price) }}</span>
              <span v-if="discountRate > 0" class="discount-rate">{{ discountRate }}% OFF</span>
              <span v-if="product.price < product.originalPrice" class="origin-price">
                {{ formatPrice(product.originalPrice) }}
              </span>
            </div>

            <!-- 설명 -->
            <p class="detail-desc">{{ product.description }}</p>

            <div class="detail-divider"></div>

            <!-- 색상 -->
            <div class="option-group">
              <p class="option-label">
                COLOR
                <span class="option-selected">{{ selectedColor || '선택해주세요' }}</span>
              </p>
              <div class="color-list">
                <button
                  v-for="color in product.colors"
                  :key="color"
                  class="color-btn"
                  :class="{ active: selectedColor === color }"
                  :style="{ background: color }"
                  :title="color"
                  @click="selectColor(color)"
                ></button>
              </div>
            </div>

            <!-- 사이즈 -->
            <div class="option-group">
              <p class="option-label">
                SIZE
                <span class="option-selected">{{ selectedSize || '선택해주세요' }}</span>
              </p>
              <div class="size-list">
                <button
                  v-for="size in product.sizes"
                  :key="size"
                  class="size-btn"
                  :class="{ active: selectedSize === size }"
                  @click="selectedSize = size"
                >
                  {{ size }}
                </button>
              </div>
            </div>

            <!-- 수량 + 장바구니 -->
            <div class="cart-row">
              <!-- 수량 -->
              <div class="qty-wrap">
                <button @click="qty = Math.max(1, qty - 1)">
                  <i class="bi bi-dash"></i>
                </button>
                <span>{{ qty }}</span>
                <button @click="qty++">
                  <i class="bi bi-plus"></i>
                </button>
              </div>

              <!-- 장바구니 -->
              <button
                class="cart-btn"
                :disabled="!selectedSize"
                @click="addToCart"
              >
                <i class="bi bi-bag-plus me-2"></i>
                {{ !selectedSize ? '사이즈를 선택해주세요' : '장바구니 담기' }}
              </button>
            </div>

            <!-- 바로 구매 -->
            <button
              class="buy-btn"
              :disabled="!selectedSize"
              @click="buyNow"
            >
              바로 구매하기
            </button>

            <!-- 재고 / 배송 -->
            <div class="stock-info">
              <span><i class="bi bi-box-seam me-1"></i> 재고 {{ product.stock }}개 남음</span>
              <span>·</span>
              <span><i class="bi bi-truck me-1"></i> 오늘 주문시 내일 배송</span>
            </div>

            <!-- 태그 -->
            <div class="tag-list">
              <span v-for="tag in product.tags" :key="tag" class="tag-item">
                #{{ tag }}
              </span>
            </div>

          </div>
        </div>

        <!-- ===== 세부 정보 ===== -->
        <div v-if="product.details" class="section-block">
          <div class="section-block-header">
            <p class="section-block-label">DETAILS</p>
            <h2 class="section-block-title">세부 정보</h2>
          </div>
          <div class="specs-list">
            <div
              v-for="(value, key) in product.details"
              :key="key"
              class="spec-row"
            >
              <span class="spec-key">{{ key }}</span>
              <span class="spec-value">{{ value }}</span>
            </div>
          </div>
        </div>

        <!-- ===== 리뷰 ===== -->
        <div class="section-block">
          <div class="section-block-header">
            <p class="section-block-label">REVIEWS</p>
            <h2 class="section-block-title">상품 리뷰</h2>
          </div>

          <div v-if="productReviews.length === 0" class="empty-review">
            아직 리뷰가 없습니다.
          </div>
          <div v-else class="row g-3">
            <div v-for="review in productReviews" :key="review.id" class="col-12 col-md-6">
              <div class="review-card">
                <div class="review-top">
                  <div>
                    <p class="review-author">{{ review.author }}</p>
                    <div class="stars small">
                      <i
                        v-for="n in 5"
                        :key="n"
                        class="bi"
                        :class="n <= review.rating ? 'bi-star-fill' : 'bi-star'"
                      ></i>
                    </div>
                  </div>
                  <span class="review-date">{{ review.date }}</span>
                </div>
                <p class="review-content">{{ review.content }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- ===== 관련 상품 ===== -->
        <div class="section-block">
          <div class="section-block-header">
            <p class="section-block-label">MORE</p>
            <h2 class="section-block-title">관련 상품</h2>
          </div>
          <div class="row g-3 g-lg-4">
            <div v-for="p in relatedProducts" :key="p.id" class="col-6 col-md-3">
              <ProductCard :product="p" />
            </div>
          </div>
        </div>

      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useShopStore } from '@/store/shop'
import ProductCard from '@/components/ProductCard.vue'

const store = useShopStore()
const route = useRoute()
const router = useRouter()

// 현재 상품
const product = computed(() => store.getProductById(route.params.id))

// 선택 상태
const selectedImage = ref('')
const selectedColor = ref(null)
const selectedSize = ref(null)
const qty = ref(1)

// 상품 바뀔 때 초기화
watch(product, (p) => {
  if (p) {
    selectedImage.value = p.images[0]
    selectedColor.value = p.colors[0]
    selectedSize.value = null
    qty.value = 1
  }
}, { immediate: true })

// 위시리스트 여부
const isWishlisted = computed(() =>
  product.value && store.isInWishlist(product.value.id)
)

// 카테고리명
const categoryName = computed(() => {
  if (!product.value) return ''
  const cat = store.categories.find(c => c.id === product.value.category)
  return cat ? cat.name : ''
})

// 할인율
const discountRate = computed(() => {
  if (!product.value || product.value.price >= product.value.originalPrice) return 0
  return Math.round((1 - product.value.price / product.value.originalPrice) * 100)
})

// 리뷰
const productReviews = computed(() =>
  store.getReviewsByProductId(route.params.id)
)

// 관련 상품
const relatedProducts = computed(() => {
  if (!product.value) return []
  return store.products
    .filter(p => p.category === product.value.category && p.id !== product.value.id)
    .slice(0, 4)
})

// 색상 클릭시 연결된 상품으로 이동
function selectColor(color) {
  const targetId = product.value?.colorProducts?.[color]
  if (targetId && targetId !== product.value.id) {
    router.push(`/product/${targetId}`)
  } else {
    selectedColor.value = color
  }
}

// 가격 포맷
function formatPrice(v) {
  return v.toLocaleString('ko-KR') + '원'
}

// 장바구니 담기
function addToCart() {
  if (!selectedSize.value) {
    store.showToast('사이즈를 선택해주세요.', 'error')
    return
  }
  store.addToCart(product.value, qty.value, selectedColor.value, selectedSize.value)
}

// 바로 구매
function buyNow() {
  if (!selectedSize.value) {
    store.showToast('사이즈를 선택해주세요.', 'error')
    return
  }
  store.addToCart(product.value, qty.value, selectedColor.value, selectedSize.value)
  router.push('/checkout')
}
</script>

<style scoped>
/* ===== 페이지 ===== */
.detail-page {
  padding: 48px 0 80px;
}

/* ===== 브레드크럼 ===== */
.breadcrumb-nav {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  letter-spacing: 0.08em;
  color: #666;
  margin-bottom: 40px;
}

.breadcrumb-nav a {
  color: #666;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-nav a:hover {
  color: #f2f0eb;
}

.breadcrumb-current {
  color: #f2f0eb;
}

/* ===== 빈 상태 ===== */
.empty-state {
  text-align: center;
  padding: 80px 0;
  color: #666;
}

.empty-state i {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
}

.empty-state p {
  margin-bottom: 20px;
}

/* ===== 메인 이미지 ===== */
.main-img-wrap {
  position: relative;
  background: #1a1a1a;
  overflow: hidden;
  margin-bottom: 12px;
  aspect-ratio: 4 / 5;
}

.main-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: opacity 0.3s;
}

.detail-badge.sale { background: #c0392b; color: #fff; }
.detail-badge.new  { background: #f2f0eb; color: #0d0d0d; }
.detail-badge.best { background: #b8a898; color: #0d0d0d; }

/* 위시리스트 버튼 */
.wish-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(13, 13, 13, 0.6);
  border: none;
  color: #f2f0eb;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 15px;
  transition: background 0.2s;
}

.wish-btn:hover {
  background: rgba(13, 13, 13, 0.9);
}

.wish-btn .bi-heart-fill {
  color: #c0392b;
}

/* ===== 썸네일 ===== */
.thumb-list {
  display: flex;
  gap: 8px;
}

.thumb-item {
  width: 72px;
  height: 72px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid transparent;
  transition: border-color 0.2s;
  flex-shrink: 0;
}

.thumb-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-item:hover {
  border-color: #888;
}

.thumb-item.active {
  border-color: #f2f0eb;
}

/* ===== 상품 정보 ===== */
.detail-category {
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 8px;
}

.detail-name {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(1.8rem, 3vw, 2.8rem);
  letter-spacing: 0.06em;
  color: #f2f0eb;
  margin-bottom: 12px;
}

/* 평점 */
.detail-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.stars i {
  font-size: 12px;
  color: #b8a898;
}

.stars.small i {
  font-size: 10px;
}

.detail-rating span {
  font-size: 13px;
  color: #888;
}

.review-count {
  color: #666;
}

/* 가격 */
.detail-price-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.detail-price {
  font-size: 24px;
  font-weight: 400;
  color: #f2f0eb;
  letter-spacing: 0.02em;
}

.discount-rate {
  font-size: 11px;
  letter-spacing: 0.08em;
  padding: 3px 8px;
  background: #c0392b;
  color: #fff;
}

.origin-price {
  font-size: 14px;
  color: #666;
  text-decoration: line-through;
}

/* 설명 */
.detail-desc {
  font-size: 14px;
  color: #888;
  line-height: 1.8;
  margin-bottom: 24px;
}

.detail-divider {
  height: 1px;
  background: rgba(255,255,255,0.08);
  margin-bottom: 24px;
}

/* ===== 옵션 ===== */
.option-group {
  margin-bottom: 20px;
}

.option-label {
  font-size: 11px;
  letter-spacing: 0.15em;
  color: #888;
  margin-bottom: 10px;
  text-transform: uppercase;
}

.option-selected {
  color: #f2f0eb;
  margin-left: 8px;
  font-size: 12px;
  letter-spacing: 0.05em;
  text-transform: none;
}

/* 색상 */
.color-list {
  display: flex;
  gap: 8px;
}

.color-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.color-btn.active {
  border-color: #f2f0eb;
  box-shadow: 0 0 0 2px #0d0d0d, 0 0 0 3px #f2f0eb;
}

/* 사이즈 */
.size-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.size-btn {
  padding: 6px 16px;
  font-size: 12px;
  letter-spacing: 0.08em;
  background: transparent;
  color: #888;
  border: 1px solid rgba(255,255,255,0.12);
  cursor: pointer;
  transition: all 0.2s;
  min-width: 52px;
}

.size-btn:hover {
  border-color: #888;
  color: #f2f0eb;
}

.size-btn.active {
  background: #f2f0eb;
  color: #0d0d0d;
  border-color: #f2f0eb;
}

/* ===== 장바구니 행 ===== */
.cart-row {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}

/* 수량 */
.qty-wrap {
  display: flex;
  align-items: center;
  border: 1px solid rgba(255,255,255,0.12);
  flex-shrink: 0;
}

.qty-wrap button {
  background: none;
  border: none;
  color: #f2f0eb;
  padding: 8px 14px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;
}

.qty-wrap button:hover {
  background: rgba(255,255,255,0.06);
}

.qty-wrap span {
  padding: 0 16px;
  font-size: 14px;
  color: #f2f0eb;
  min-width: 40px;
  text-align: center;
}

/* 장바구니 버튼 */
.cart-btn {
  flex: 1;
  padding: 12px;
  background: #f2f0eb;
  color: #0d0d0d;
  border: none;
  font-size: 12px;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: opacity 0.2s;
}

.cart-btn:hover:not(:disabled) {
  opacity: 0.85;
}

.cart-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* 바로 구매 */
.buy-btn {
  width: 100%;
  padding: 12px;
  background: transparent;
  color: #f2f0eb;
  border: 1px solid rgba(255,255,255,0.3);
  font-size: 12px;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 20px;
}

.buy-btn:hover:not(:disabled) {
  border-color: #f2f0eb;
}

.buy-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* 재고/배송 */
.stock-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #666;
  margin-bottom: 16px;
}

/* 태그 */
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-item {
  font-size: 11px;
  color: #666;
  border: 1px solid rgba(255,255,255,0.08);
  padding: 3px 8px;
  letter-spacing: 0.05em;
}

/* ===== 섹션 블록 (리뷰, 관련상품) ===== */
.section-block {
  margin-top: 64px;
  padding-top: 40px;
  border-top: 1px solid rgba(255,255,255,0.08);
}

.section-block-header {
  margin-bottom: 28px;
}

.section-block-label {
  font-size: 11px;
  letter-spacing: 0.2em;
  color: #888;
  margin-bottom: 4px;
}

.section-block-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 32px;
  letter-spacing: 0.08em;
  color: #f2f0eb;
  margin: 0;
}

/* 리뷰 카드 */
.review-card {
  background: #161616;
  border: 1px solid rgba(255,255,255,0.06);
  padding: 20px;
}

.review-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.review-author {
  font-size: 13px;
  color: #f2f0eb;
  margin-bottom: 4px;
}

.review-date {
  font-size: 11px;
  color: #666;
}

.review-content {
  font-size: 13px;
  color: #888;
  line-height: 1.7;
  margin: 0;
}

.empty-review {
  font-size: 13px;
  color: #666;
  padding: 20px 0;
}

/* ===== 아웃라인 버튼 ===== */
.detail-btn-outline {
  display: inline-block;
  padding: 10px 24px;
  border: 1px solid rgba(255,255,255,0.3);
  color: #f2f0eb;
  font-size: 12px;
  letter-spacing: 0.1em;
  text-decoration: none;
  transition: border-color 0.2s;
}

.detail-btn-outline:hover {
  border-color: #f2f0eb;
}

/* ===== 세부 정보 ===== */
.specs-list {
  border-top: 1px solid rgba(255,255,255,0.08);
}

.spec-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  font-size: 13px;
  gap: 24px;
}

.spec-key {
  color: #888;
  flex-shrink: 0;
  min-width: 140px;
}

.spec-value {
  color: #f2f0eb;
  text-align: right;
  line-height: 1.6;
}

/* ===== 모바일 ===== */
@media (max-width: 768px) {
  .detail-page {
    padding: 32px 0 60px;
  }

  .cart-row {
    flex-direction: column;
    align-items: stretch;
  }

  .qty-wrap {
    justify-content: center;
  }
}
</style>