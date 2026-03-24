<template>
  <div class="cart-page">
    <div class="container">
      <!-- ===== 페이지 타이틀 ===== -->
      <div class="cart-header">
        <p class="cart-label">SHOPPING BAG</p>
        <h1 class="cart-title">장바구니</h1>
      </div>

      <!-- ===== 장바구니 비어있음 ===== -->
      <div v-if="store.cart.length === 0" class="empty-cart">
        <i class="bi bi-bag"></i>
        <p class="empty-text">장바구니가 비어있습니다.</p>
        <RouterLink to="/products" class="empty-btn">쇼핑 계속하기</RouterLink>
      </div>

      <!-- ===== 장바구니 내용 ===== -->
      <div v-else class="row g-4">
        <!-- 왼쪽: 상품 목록 -->
        <div class="col-lg-8">
          <!-- 상단 정보 -->
          <div class="cart-info-row">
            <span class="cart-count-text">총 {{ store.cartCount }}개 상품</span>
            <button class="clear-btn" @click="store.clearCart()">전체 삭제</button>
          </div>

          <!-- 상품 리스트 -->
          <div class="cart-list">
            <div v-for="item in cartItems" :key="item.id" class="cart-item">
              <!-- 상품 이미지 -->
              <RouterLink :to="`/product/${item.itemId}`" class="item-img-wrap">
                <img :src="item.image" :alt="item.name" class="item-img" />
              </RouterLink>

              <!-- 상품 정보 -->
              <div class="item-info">
                <div class="item-top">
                  <RouterLink :to="`/product/${item.itemId}`" class="item-name">
                    {{ item.name }}
                  </RouterLink>
                  <button class="item-remove" @click="store.removeFromCart(item.id)">
                    <i class="bi bi-x"></i>
                  </button>
                </div>

                <!-- 색상 / 사이즈 -->
                <div class="item-options">
                  <span v-if="item.color" class="item-color">
                    <span class="color-dot" :style="{ background: item.color }"></span>
                    <span style="font-size: 11px; color: #888; margin-left: 4px">{{
                      item.color
                    }}</span>
                  </span>
                  <span v-if="item.color && item.size" style="color: #555">|</span>
                  <span v-if="item.size" class="item-size">{{ item.size }}</span>
                  <span
                    v-if="!item.color && !item.size"
                    style="font-size: 11px; color: #555"
                    >옵션 없음</span
                  >
                </div>
                <!-- 수량 + 가격 -->
                <div class="item-bottom">
                  <div class="qty-wrap">
                    <button @click="store.updateCartQty(item.id, item.qty - 1)">
                      <i class="bi bi-dash"></i>
                    </button>
                    <span>{{ item.qty }}</span>
                    <button @click="store.updateCartQty(item.id, item.qty + 1)">
                      <i class="bi bi-plus"></i>
                    </button>
                  </div>
                  <span class="item-price">
                    {{ (item.price * item.qty).toLocaleString() }}원
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 오른쪽: 주문 요약 -->
        <div class="col-lg-4">
          <div class="order-summary">
            <p class="summary-label">ORDER SUMMARY</p>
            <h2 class="summary-title">주문 요약</h2>

            <div class="summary-divider"></div>

            <!-- 금액 정보 -->
            <div class="summary-row">
              <span>상품 금액</span>
              <span>{{ store.cartTotal.toLocaleString() }}원</span>
            </div>
            <div class="summary-row">
              <span>배송비</span>
              <span :class="{ 'free-shipping': shippingFree }">
                {{ shippingFree ? "무료" : "3,000원" }}
              </span>
            </div>

            <!-- 무료배송까지 남은 금액 -->
            <div v-if="!shippingFree" class="shipping-notice">
              {{ (50000 - store.cartTotal).toLocaleString() }}원 더 구매시 무료 배송
            </div>

            <div class="summary-divider"></div>

            <!-- 총 금액 -->
            <div class="summary-total">
              <span>총 결제금액</span>
              <span>{{ totalWithShipping.toLocaleString() }}원</span>
            </div>

            <!-- 구매 버튼 -->
            <RouterLink to="/checkout" class="checkout-btn">
              구매하기 ({{ store.cartCount }}개)
            </RouterLink>
            <RouterLink to="/products" class="continue-btn"> 쇼핑 계속하기 </RouterLink>

            <!-- 안전결제 -->
            <div class="safe-pay">
              <i class="bi bi-credit-card"></i>
              <i class="bi bi-phone"></i>
              <i class="bi bi-shield-check"></i>
              <p>안전 결제 보장</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useShopStore } from "@/store/shop";

const store = useShopStore();

// 장바구니 아이템에 상품 정보 합치기
const cartItems = computed(() => {
  return store.cart.map((item) => {
    const product = store.getProductById(item.itemId);
    return {
      ...item,
      name: product?.name || "상품명 없음",
      price: product?.price || 0,
      image: product?.images?.[0] || "",
      discountRate: product?.discountRate || 0,
    };
  });
});

// 5만원 이상 무료배송
const shippingFree = computed(() => store.cartTotal >= 50000);

// 배송비 포함 총액
const totalWithShipping = computed(
  () => store.cartTotal + (shippingFree.value ? 0 : 3000)
);

onMounted(() => {
  store.fetchData();
});
</script>

<style scoped>
/* ===== 페이지 ===== */
.cart-page {
  padding: 48px 0 80px;
}

/* ===== 헤더 ===== */
.cart-header {
  margin-bottom: 40px;
}

.cart-label {
  font-size: 11px;
  letter-spacing: 0.2em;
  color: #888;
  margin-bottom: 4px;
}

.cart-title {
  font-family: "Bebas Neue", sans-serif;
  font-size: 40px;
  letter-spacing: 0.08em;
  color: #f2f0eb;
  margin: 0;
}

/* ===== 빈 장바구니 ===== */
.empty-cart {
  text-align: center;
  padding: 80px 0;
}

.empty-cart i {
  font-size: 48px;
  color: #444;
  display: block;
  margin-bottom: 16px;
}

.empty-text {
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

.empty-btn:hover {
  opacity: 0.85;
}

/* ===== 상단 정보 행 ===== */
.cart-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.cart-count-text {
  font-size: 13px;
  color: #888;
}

.clear-btn {
  font-size: 12px;
  color: #888;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}

.clear-btn:hover {
  color: #c0392b;
}

/* ===== 상품 리스트 ===== */
.cart-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: rgba(255, 255, 255, 0.06);
}

/* ===== 장바구니 아이템 ===== */
.cart-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: #0d0d0d;
}

/* 이미지 */
.item-img-wrap {
  flex-shrink: 0;
}

.item-img {
  width: 90px;
  height: 110px;
  object-fit: cover;
  display: block;
  background: #1a1a1a;
}

/* 정보 */
.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.item-name {
  font-size: 14px;
  letter-spacing: 0.05em;
  color: #f2f0eb;
  text-decoration: none;
}

.item-name:hover {
  opacity: 0.7;
}

.item-remove {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  transition: color 0.2s;
  line-height: 1;
}

.item-remove:hover {
  color: #f2f0eb;
}

/* 옵션 */
.item-options {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #888;
}

.color-dot {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.item-size {
  font-size: 12px;
  color: #888;
}

/* 수량 + 가격 */
.item-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.qty-wrap {
  display: flex;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.qty-wrap button {
  background: none;
  border: none;
  color: #f2f0eb;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.qty-wrap button:hover {
  background: rgba(255, 255, 255, 0.06);
}

.qty-wrap span {
  padding: 0 12px;
  font-size: 13px;
  color: #f2f0eb;
  min-width: 32px;
  text-align: center;
}

.item-price {
  font-size: 14px;
  color: #f2f0eb;
}

/* ===== 주문 요약 ===== */
.order-summary {
  background: #111;
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 28px;
  position: sticky;
  top: 80px;
}

.summary-label {
  font-size: 11px;
  letter-spacing: 0.2em;
  color: #888;
  margin-bottom: 4px;
}

.summary-title {
  font-family: "Bebas Neue", sans-serif;
  font-size: 28px;
  letter-spacing: 0.08em;
  color: #f2f0eb;
  margin-bottom: 0;
}

.summary-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 20px 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #888;
  margin-bottom: 10px;
}

.free-shipping {
  color: #b8a898 !important;
}

.shipping-notice {
  font-size: 11px;
  color: #b8a898;
  margin-bottom: 10px;
  letter-spacing: 0.03em;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  color: #f2f0eb;
  margin-bottom: 24px;
}

/* 버튼 */
.checkout-btn {
  display: block;
  text-align: center;
  padding: 14px;
  background: #f2f0eb;
  color: #0d0d0d;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-decoration: none;
  margin-bottom: 8px;
  transition: opacity 0.2s;
}

.checkout-btn:hover {
  opacity: 0.85;
}

.continue-btn {
  display: block;
  text-align: center;
  padding: 14px;
  background: transparent;
  color: #888;
  font-size: 12px;
  letter-spacing: 0.1em;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition: all 0.2s;
}

.continue-btn:hover {
  border-color: #f2f0eb;
  color: #f2f0eb;
}

/* 안전결제 */
.safe-pay {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.safe-pay i {
  font-size: 16px;
  color: #555;
}

.safe-pay p {
  width: 100%;
  text-align: center;
  font-size: 11px;
  color: #555;
  margin: 0;
  letter-spacing: 0.05em;
}

/* ===== 모바일 ===== */
@media (max-width: 768px) {
  .cart-page {
    padding: 32px 0 60px;
  }

  .item-img {
    width: 70px;
    height: 86px;
  }
}
</style>
