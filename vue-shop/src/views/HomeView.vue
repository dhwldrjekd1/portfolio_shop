<template>
  <div>

    <!-- ===== Hero 슬라이드 섹션 ===== -->
    <section class="hero-section">
      <div class="hero-slide">

        <!-- 현재 슬라이드: 동영상 or 이미지 -->
        <Transition name="hero-fade" mode="out-in">
          <video
            v-if="currentSlide.type === 'video'"
            :key="'video-' + currentIdx"
            class="hero-media"
            autoplay
            muted
            playsinline
            preload="auto"
            :src="currentSlide.src"
            @ended="nextSlide"
            @error="nextSlide"
          ></video>
          <img
            v-else
            :key="'image-' + currentIdx"
            class="hero-media"
            :src="currentSlide.src"
            :alt="currentSlide.alt"
          />
        </Transition>

        <!-- 어두운 오버레이 -->
        <div class="hero-overlay"></div>

        <!-- 텍스트 영역 -->
        <Transition name="hero-fade" mode="out-in">
          <div class="hero-content" :key="'content-' + currentIdx">
            <p class="hero-sub">{{ currentBanner?.subtitle }}</p>
            <h1 class="hero-title">{{ currentBanner?.title }}</h1>
            <p class="hero-desc">{{ currentBanner?.description }}</p>
            <RouterLink
              :to="currentBanner?.collectionId ? `/collections?tab=${currentBanner.collectionId}` : `/products?category=${currentBanner?.category}`"
              class="hero-btn"
            >
              {{ currentBanner?.cta }} <i class="bi bi-arrow-right ms-2"></i>
            </RouterLink>
          </div>
        </Transition>

        <!-- 양옆 화살표 버튼 -->
        <button class="hero-arrow left" @click="prevSlide">
          <i class="bi bi-chevron-left"></i>
        </button>
        <button class="hero-arrow right" @click="nextSlide">
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </section>

    <!-- ===== 신상품 ===== -->
    <section class="product-section">
      <div class="container">
        <div class="section-header">
          <div>
            <p class="section-label">신상품</p>
            <h2 class="section-title">새롭게 선보이는 젠틀몬스터 신제품</h2>
          </div>
          <RouterLink to="/products?badge=NEW" class="section-link">
            전체 보기 <i class="bi bi-arrow-right"></i>
          </RouterLink>
        </div>
        <div class="row g-3 g-lg-4">
          <div v-for="product in newProducts" :key="product.id" class="col-6 col-md-4 col-lg-3">
            <ProductCard :product="product" />
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 베스트셀러 ===== -->
    <section class="product-section">
      <div class="container">
        <div class="section-header">
          <div>
            <p class="section-label">베스트셀러</p>
            <h2 class="section-title">Best Sellers</h2>
          </div>
          <RouterLink to="/products?badge=BEST" class="section-link">
            전체 보기 <i class="bi bi-arrow-right"></i>
          </RouterLink>
        </div>
        <div class="row g-3 g-lg-4">
          <div v-for="product in bestProducts" :key="product.id" class="col-6 col-md-4 col-lg-3">
            <ProductCard :product="product" />
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 슬라이딩 텍스트 배너 ===== -->
    <section class="ticker-section">
      <div class="ticker-wrap">
        <div class="ticker-track">
          <span v-for="n in 3" :key="n" class="ticker-inner">
            <span class="ticker-item">UNOPENED FUTURE</span>
            <span class="ticker-dot">·</span>
            <span class="ticker-item">열리지 않은 미래</span>
            <span class="ticker-dot">·</span>
            <span class="ticker-item">EXPERIMENTAL</span>
            <span class="ticker-dot">·</span>
            <span class="ticker-item">실험적 존재</span>
            <span class="ticker-dot">·</span>
            <span class="ticker-item">2026 COLLECTION</span>
            <span class="ticker-dot">·</span>
            <span class="ticker-item bold">GENTLE MONSTER</span>
            <span class="ticker-dot">·</span>
          </span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useShopStore } from '@/store/shop'
import ProductCard from '@/components/ProductCard.vue'

const store = useShopStore()

// BASE_URL 자동으로 /web03/ 붙여줌
const base = import.meta.env.BASE_URL

// ===== 슬라이드 목록 =====
const slides = [
  { type: 'video', src: `${base}video/main_pc.mp4` },
  { type: 'video', src: `${base}video/main_pc1.mp4` },
  { type: 'video', src: `${base}video/main_pc2.mp4` },
  { type: 'video', src: `${base}video/main_pc3.mp4` }
]

// 현재 슬라이드 인덱스
const currentIdx = ref(0)

// 현재 슬라이드
const currentSlide = computed(() => slides[currentIdx.value])

// 배너 텍스트 (슬라이드 수만큼 순환)
const currentBanner = computed(() => {
  if (!store.banners.length) return null
  return store.banners[currentIdx.value % store.banners.length]
})

// 이미지 슬라이드 자동 전환 타이머
let imageTimer = null

function clearImageTimer() {
  clearTimeout(imageTimer)
  imageTimer = null
}

function startImageTimer() {
  clearImageTimer()
  if (currentSlide.value.type === 'image') {
    imageTimer = setTimeout(() => nextSlide(), 5000)
  }
}

// 다음 슬라이드
function nextSlide() {
  currentIdx.value = (currentIdx.value + 1) % slides.length
  startImageTimer()
}

// 이전 슬라이드
function prevSlide() {
  currentIdx.value = (currentIdx.value - 1 + slides.length) % slides.length
  startImageTimer()
}

onMounted(() => startImageTimer())
onUnmounted(() => clearImageTimer())

const newProducts = computed(() => store.products.filter(p => p.badge === 'NEW').slice(0, 8))
const bestProducts = computed(() => store.products.filter(p => p.badge === 'BEST').slice(0, 8))

const features = [
  { icon: 'bi-truck',             title: '무료 배송', desc: '5만원 이상 구매시 무료 배송' },
  { icon: 'bi-arrow-return-left', title: '30일 반품', desc: '조건없는 30일 무료 반품' },
  { icon: 'bi-shield-check',      title: '안전 결제', desc: '안전한 암호화 결제 시스템' },
  { icon: 'bi-headset',           title: '고객 지원', desc: '24/7 전문 고객 지원 서비스' }
]
</script>

<style scoped>
/* ===== Hero ===== */
.hero-slide {
  position: relative;
  height: 88vh;
  min-height: 500px;
  overflow: hidden;
}

.hero-media {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 70%);
  z-index: 1;
}

.hero-content {
  position: absolute;
  top: 50%;
  left: 5%;
  transform: translateY(-50%);
  max-width: 560px;
  color: #f2f0eb;
  z-index: 10;
}

.hero-sub {
  font-size: 12px !important;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  opacity: 0.75;
  margin-bottom: 12px;
  font-family: 'DM Sans', sans-serif !important;
}

.hero-title {
  font-family: 'Bebas Neue', sans-serif !important;
  font-size: clamp(2.5rem, 6vw, 3rem) !important;
  line-height: 1.05;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
  font-weight: 400 !important;
}

.hero-desc {
  font-size: 15px !important;
  opacity: 0.8;
  margin-bottom: 28px;
  max-width: 380px;
  font-family: 'DM Sans', sans-serif !important;
}

.hero-btn {
  display: inline-block;
  padding: 12px 32px;
  background: #f2f0eb;
  color: #0d0d0d;
  font-size: 12px;
  letter-spacing: 0.1em;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}

.hero-btn:hover {
  background: transparent;
  color: #f2f0eb;
  outline: 1px solid #f2f0eb;
}

/* ===== 화살표 버튼 ===== */
.hero-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background: none;
  border: none;
  color: rgba(242, 240, 235, 0.7);
  font-size: 28px;
  cursor: pointer;
  padding: 16px 20px;
  transition: color 0.2s;
  line-height: 1;
}

.hero-arrow.left  { left: 0; }
.hero-arrow.right { right: 0; }

.hero-arrow:hover { color: #f2f0eb; }

/* ===== 슬라이드 전환 애니메이션 ===== */
.hero-fade-enter-active,
.hero-fade-leave-active {
  transition: opacity 0.5s ease;
}

.hero-fade-enter-from,
.hero-fade-leave-to {
  opacity: 0;
}



/* ===== 상품 섹션 ===== */
.product-section { padding: 64px 0; }

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;
}

.section-label {
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 4px;
}

.section-title {
  font-family: 'Bebas Neue', sans-serif !important;
  font-size: 30px !important;
  letter-spacing: 0.08em;
  color: #f2f0eb !important;
  margin: 0;
  font-weight: 400 !important;
}

.section-link {
  font-size: 12px;
  letter-spacing: 0.1em;
  color: #888;
  text-decoration: none;
  transition: color 0.2s;
}

.section-link:hover { color: #f2f0eb; }

.promo-label {
  font-size: 11px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #b8a898;
  margin-bottom: 16px;
}

.promo-title {
  font-family: 'Bebas Neue', sans-serif !important;
  font-size: clamp(2rem, 4vw, 3rem) !important;
  letter-spacing: 0.06em;
  color: #f2f0eb !important;
  margin-bottom: 12px;
  font-weight: 400 !important;
}

.promo-desc {
  font-size: 14px;
  color: #888;
  margin-bottom: 32px;
}

.promo-btn {
  display: inline-block;
  padding: 12px 40px;
  background: #b8a898;
  color: #0d0d0d;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-decoration: none;
  transition: opacity 0.2s;
}

.promo-btn:hover { opacity: 0.85; }

/* 슬라이딩 텍스트 배너 */
.ticker-section {
  background-color: #0d0d0d; /* 배경은 화이트로 깔끔하게 */
  padding: 40px 0;        /* 영상 아래 공간 확보 */
  border-bottom: 1px solid #0d0d0d;
}

.ticker-wrap {
  overflow: hidden;
  white-space: nowrap;
}

.ticker-track {
  display: inline-block;
  animation: ticker-move 40s linear infinite; /* 아주 천천히 흐르게 */
}

.ticker-item {
  font-family: 'Helvetica', sans-serif;
  font-size: 0.85rem;      /* 1.2rem보다 살짝 줄여서 여백의 미 강조 */
  font-weight: 300;
  letter-spacing: 0.4em;   /* 자간을 0.2 -> 0.4로 더 과감하게 벌림 */
  text-transform: uppercase;
  color: #fff;
}

.ticker-dot {
  margin: 0 45px;          /* 점 사이의 간격을 더 넓혀서 시원하게 */
  color: #0d0d0d;          /* 블루보틀 포인트 유지 */
  font-size: 1.5rem;       /* 점을 텍스트보다 살짝 크게 하면 더 감각적임 */
  vertical-align: middle;
}

@keyframes ticker-move {
  0% { transform: translateX(0); }
  100% { transform: translateX(-33.33%); } /* n in 3 이므로 */
}


/* ===== 모바일 ===== */
@media (max-width: 768px) {
  .hero-slide { height: 60vh; }
  .category-list { gap: 20px; }
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>