<template>
  <div class="wishlist-page">
    <div class="container">

      <!-- ===== 헤더 ===== -->
      <div class="wishlist-header">
        <p class="wishlist-label">WISHLIST</p>
        <h1 class="wishlist-title">위시리스트</h1>
      </div>

      <!-- ===== 비어있음 ===== -->
      <div v-if="store.wishlist.length === 0" class="empty-state">
        <i class="bi bi-heart"></i>
        <p>위시리스트가 비어있습니다.</p>
        <RouterLink to="/products" class="empty-btn">상품 둘러보기</RouterLink>
      </div>

      <!-- ===== 위시리스트 목록 ===== -->
      <div v-else>
        <p class="wishlist-count">총 {{ store.wishlist.length }}개의 상품</p>

        <div class="row g-3 g-lg-4">
          <div v-for="item in store.wishlist" :key="item.id" class="col-6 col-md-4 col-lg-3">
            <div class="wish-card">

              <!-- 이미지 -->
              <RouterLink :to="`/product/${item.id}`" class="wish-img-wrap">
                <img :src="item.images?.[0]" :alt="item.name" class="wish-img" />

                <!-- 호버시 두번째 이미지 -->
                <img
                  v-if="item.images?.[1]"
                  :src="item.images[1]"
                  :alt="item.name"
                  class="wish-img wish-img-hover"
                />

                <!-- 뱃지 -->
                <span v-if="item.badge" class="wish-badge" :class="item.badge.toLowerCase()">
                  {{ item.badge }}
                </span>
              </RouterLink>

              <!-- 위시리스트 제거 버튼 -->
              <button class="wish-remove" @click="store.toggleWishlist(item)">
                <i class="bi bi-heart-fill"></i>
              </button>

              <!-- 상품 정보 -->
              <div class="wish-info">
                <RouterLink :to="`/product/${item.id}`" class="wish-name">
                  {{ item.name }}
                </RouterLink>

                <!-- 평점 -->
                <div class="wish-stars">
                  <i
                    v-for="n in 5"
                    :key="n"
                    class="bi"
                    :class="n <= Math.round(item.rating) ? 'bi-star-fill' : 'bi-star'"
                  ></i>
                </div>

                <!-- 가격 -->
                <div class="wish-price-wrap">
                  <span class="wish-price">{{ item.price.toLocaleString() }}원</span>
                  <span v-if="item.price < item.originalPrice" class="wish-price-origin">
                    {{ item.originalPrice.toLocaleString() }}원
                  </span>
                </div>

                <!-- 장바구니 버튼 -->
                <button class="wish-cart-btn" @click="moveToCart(item)">
                  <i class="bi bi-bag-plus me-1"></i> 장바구니 담기
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useShopStore } from '@/store/shop'

const store = useShopStore()

// 위시리스트 상품 장바구니로 이동
function moveToCart(item) {
  const product = store.getProductById(item.id)
  if (product) {
    store.addToCart(product, 1, product.colors[0], product.sizes[0])
  }
}
</script>

<style scoped>
/* ===== 페이지 ===== */
.wishlist-page {
  padding: 48px 0 80px;
}

/* ===== 헤더 ===== */
.wishlist-header {
  margin-bottom: 40px;
}

.wishlist-label {
  font-size: 11px;
  letter-spacing: 0.2em;
  color: #888;
  margin-bottom: 4px;
}

.wishlist-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 40px;
  letter-spacing: 0.08em;
  color: #f2f0eb;
  margin: 0;
}

/* ===== 빈 상태 ===== */
.empty-state {
  text-align: center;
  padding: 80px 0;
}

.empty-state i {
  font-size: 48px;
  color: #444;
  display: block;
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 14px;
  color: #888;
  margin-bottom: 24px;
}

.empty-btn {
  display: inline-block;
  padding: 12px 32px;
  background: #f2f0eb;
  color: #0d0d0d;
  font-size: 12px;
  letter-spacing: 0.1em;
  text-decoration: none;
  transition: opacity 0.2s;
}

.empty-btn:hover { opacity: 0.85; }

/* ===== 개수 ===== */
.wishlist-count {
  font-size: 13px;
  color: #888;
  margin-bottom: 24px;
}

/* ===== 카드 ===== */
.wish-card {
  position: relative;
}

/* 이미지 */
.wish-img-wrap {
  display: block;
  position: relative;
  overflow: hidden;
  aspect-ratio: 3 / 4;
  background: #1a1a1a;
  margin-bottom: 12px;
}

.wish-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: opacity 0.4s ease;
}

.wish-img-hover {
  position: absolute;
  inset: 0;
  opacity: 0;
}

.wish-img-wrap:hover .wish-img:first-child { opacity: 0; }
.wish-img-wrap:hover .wish-img-hover { opacity: 1; }

/* 뱃지 */
.wish-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 10px;
  letter-spacing: 0.08em;
  padding: 3px 8px;
}

.wish-badge.sale { background: #c0392b; color: #fff; }
.wish-badge.new  { background: #f2f0eb; color: #0d0d0d; }
.wish-badge.best { background: #b8a898; color: #0d0d0d; }

/* 제거 버튼 */
.wish-remove {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(13,13,13,0.6);
  border: none;
  color: #c0392b;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.2s;
}

.wish-remove:hover { background: rgba(13,13,13,0.9); }

/* 정보 */
.wish-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.wish-name {
  font-size: 13px;
  letter-spacing: 0.05em;
  color: #f2f0eb;
  text-decoration: none;
}

.wish-name:hover { opacity: 0.7; }

/* 평점 */
.wish-stars i {
  font-size: 10px;
  color: #b8a898;
}

/* 가격 */
.wish-price-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}

.wish-price {
  font-size: 13px;
  color: #f2f0eb;
}

.wish-price-origin {
  font-size: 12px;
  color: #666;
  text-decoration: line-through;
}

/* 장바구니 버튼 */
.wish-cart-btn {
  width: 100%;
  padding: 9px;
  background: transparent;
  color: #f2f0eb;
  border: 1px solid rgba(255,255,255,0.2);
  font-size: 11px;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 4px;
}

.wish-cart-btn:hover {
  background: #f2f0eb;
  color: #0d0d0d;
  border-color: #f2f0eb;
}

/* ===== 모바일 ===== */
@media (max-width: 768px) {
  .wishlist-page { padding: 32px 0 60px; }
}
</style>