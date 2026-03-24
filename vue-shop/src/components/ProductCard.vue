<template>
  <div class="product-card" @click="goToProduct">
    <!-- 상품 이미지 -->
    <div class="card-img-wrap">
      <img :src="product.images[0]" :alt="product.name" class="card-img" />

      <!-- 호버시 두번째 이미지 -->
      <img
        v-if="product.images[1]"
        :src="product.images[1]"
        :alt="product.name"
        class="card-img card-img-hover"
      />
      <!-- 뱃지 -->
      <span v-if="product.badge" class="card-badge" :class="badgeClass">
        {{ product.badge }}
      </span>

      <!-- 위시리스트 버튼 -->
      <button class="card-wish" @click.stop="store.toggleWishlist(product)">
        <i
          :class="store.isInWishlist(product.id) ? 'bi bi-heart-fill' : 'bi bi-heart'"
        ></i>
      </button>
    </div>

    <!-- 상품 정보 -->
    <div class="card-info">
      <p class="card-name">{{ product.name }}</p>

      <!-- 가격 -->
      <div class="card-price-wrap">
        <span v-if="product.discountRate > 0" class="card-price-origin">
          {{ product.price.toLocaleString() }}원
        </span>
        <span class="card-price" :class="{ sale: product.discountRate > 0 }">
          {{ discountedPrice.toLocaleString() }}원
        </span>
        <span v-if="product.discountRate > 0" class="card-discount">
          {{ product.discountRate }}% OFF
        </span>
      </div>

      <!-- 평점 -->
      <div class="card-rating" v-if="product.avgRating > 0">
        <i class="bi bi-star-fill"></i>
        <span>{{ product.avgRating.toFixed(1) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useShopStore } from "@/store/shop";

// props 로 상품 데이터 받기
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const store = useShopStore();
const router = useRouter();

// 뱃지 클래스 - 특수문자 있어도 안전하게 처리
const badgeClass = computed(() => {
  const badge = props.product.badge;
  if (!badge) return "";
  if (badge === "NEW") return "badge-new";
  if (badge === "BEST") return "badge-best";
  if (badge === "SALE") return "badge-sale";
  return "badge-default";
});

// 할인가 계산 (백원 단위 반올림)
const discountedPrice = computed(() => {
  if (!props.product.discountRate) return props.product.price;
  const discounted = props.product.price * (1 - props.product.discountRate / 100);
  return Math.round(discounted / 100) * 100;
});

// 상품 상세 페이지로 이동
function goToProduct() {
  router.push(`/product/${props.product.id}`);
}
</script>

<style scoped>
/* ===== 카드 전체 ===== */
.product-card {
  cursor: pointer;
}

/* ===== 이미지 영역 ===== */
.card-img-wrap {
  position: relative;
  overflow: hidden;
  aspect-ratio: 3 / 4;
  background: #1a1a1a;
  margin-bottom: 12px;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: opacity 0.4s ease;
}

/* 호버시 두번째 이미지 표시 */
.card-img-hover {
  position: absolute;
  inset: 0;
  opacity: 0;
}

.card-img-wrap:hover .card-img:first-child {
  opacity: 0;
}

.card-img-wrap:hover .card-img-hover {
  opacity: 1;
}

/* ===== 뱃지 ===== */
.card-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 10px;
  letter-spacing: 0.08em;
  padding: 3px 8px;
  color: #0d0d0d;
  background: #f2f0eb;
}

.card-badge.badge-sale {
  background: #c0392b;
  color: #fff;
}
.card-badge.badge-new {
  background: #f2f0eb;
  color: #0d0d0d;
}
.card-badge.badge-best {
  background: #b8a898;
  color: #0d0d0d;
}
.card-badge.badge-default {
  background: #444;
  color: #f2f0eb;
}

/* ===== 위시리스트 버튼 ===== */
.card-wish {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #f2f0eb;
  font-size: 15px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
  padding: 4px;
}

.card-img-wrap:hover .card-wish {
  opacity: 1;
}

.card-wish .bi-heart-fill {
  color: #c0392b;
  opacity: 1 !important;
}

/* 위시리스트에 있으면 항상 표시 */
.card-wish:has(.bi-heart-fill) {
  opacity: 1;
}

/* ===== 상품 정보 ===== */
.card-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-name {
  font-family: "DM Sans", sans-serif;
  font-size: 13px;
  letter-spacing: 0.08em;
  color: #f2f0eb;
  margin: 0;
}

/* ===== 가격 ===== */
.card-price-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}

.card-price-origin {
  font-size: 12px;
  color: #666;
  text-decoration: line-through;
}

.card-price {
  font-size: 13px;
  color: #f2f0eb;
}

.card-price.sale {
  color: #c0392b;
}

/* ===== 평점 ===== */
.card-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #b8a898;
}

.card-review {
  color: #666;
}

.card-discount {
  font-size: 10px;
  letter-spacing: 0.08em;
  padding: 2px 6px;
  background: #c0392b;
  color: #fff;
}
</style>
