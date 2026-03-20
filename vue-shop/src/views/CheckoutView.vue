<template>
  <div class="checkout-page">
    <div class="container">

      <!-- ===== 헤더 ===== -->
      <div class="checkout-header">
        <p class="checkout-label">CHECKOUT</p>
        <h1 class="checkout-title">결제하기</h1>
      </div>

      <!-- ===== 스텝 인디케이터 ===== -->
      <div class="step-indicator">
        <span :class="{ active: step >= 1 }">1. 배송 정보</span>
        <i class="bi bi-chevron-right"></i>
        <span :class="{ active: step >= 2 }">2. 결제 수단</span>
        <i class="bi bi-chevron-right"></i>
        <span :class="{ active: step >= 3 }">3. 확인 및 결제</span>
      </div>

      <!-- ===== 장바구니 비어있음 ===== -->
      <div v-if="store.cart.length === 0" class="empty-state">
        <p>장바구니가 비어있습니다.</p>
        <RouterLink to="/products" class="empty-btn">쇼핑하기</RouterLink>
      </div>

      <div v-else class="row g-4">

        <!-- ===== 왼쪽: 폼 ===== -->
        <div class="col-lg-7">

          <!-- Step 1: 배송 정보 -->
          <div v-if="step === 1" class="step-block">
            <h2 class="step-title">배송 정보</h2>
            <div class="row g-3">
              <div class="col-6">
                <label class="form-label-custom">이름</label>
                <input v-model="form.name" type="text" class="input-custom" placeholder="홍길동" />
              </div>
              <div class="col-6">
                <label class="form-label-custom">전화번호</label>
                <input v-model="form.phone" type="tel" class="input-custom" placeholder="010-0000-0000" />
              </div>
              <div class="col-12">
                <label class="form-label-custom">이메일</label>
                <input v-model="form.email" type="email" class="input-custom" placeholder="example@email.com" />
              </div>
              <div class="col-4">
                <label class="form-label-custom">우편번호</label>
                <input v-model="form.zipcode" type="text" class="input-custom" placeholder="12345" />
              </div>
              <div class="col-8">
                <label class="form-label-custom">주소</label>
                <input v-model="form.address" type="text" class="input-custom" placeholder="서울시 강남구" />
              </div>
              <div class="col-12">
                <label class="form-label-custom">상세 주소</label>
                <input v-model="form.addressDetail" type="text" class="input-custom" placeholder="상세 주소 입력" />
              </div>
              <div class="col-12">
                <label class="form-label-custom">배송 메모</label>
                <select v-model="form.memo" class="input-custom">
                  <option value="">배송 메모 선택 (선택)</option>
                  <option>문 앞에 놓아주세요</option>
                  <option>경비실에 맡겨주세요</option>
                  <option>배송 전 연락 바랍니다</option>
                  <option>직접 입력</option>
                </select>
              </div>
            </div>
            <button class="step-next-btn" @click="nextStep">
              다음 단계 <i class="bi bi-arrow-right ms-1"></i>
            </button>
          </div>

          <!-- Step 2: 결제 수단 -->
          <div v-if="step === 2" class="step-block">
            <h2 class="step-title">결제 수단</h2>
            <div class="payment-list">
              <label
                v-for="method in paymentMethods"
                :key="method.value"
                class="payment-item"
                :class="{ active: form.payment === method.value }"
              >
                <input type="radio" v-model="form.payment" :value="method.value" />
                <i class="bi" :class="method.icon"></i>
                <span>{{ method.label }}</span>
              </label>
            </div>

            <!-- 카드 입력 -->
            <div v-if="form.payment === 'card'" class="row g-3 mb-4">
              <div class="col-12">
                <label class="form-label-custom">카드 번호</label>
                <input type="text" class="input-custom" placeholder="0000 0000 0000 0000" />
              </div>
              <div class="col-6">
                <label class="form-label-custom">유효 기간</label>
                <input type="text" class="input-custom" placeholder="MM/YY" />
              </div>
              <div class="col-6">
                <label class="form-label-custom">CVC</label>
                <input type="text" class="input-custom" placeholder="000" />
              </div>
            </div>

            <div class="step-btn-row">
              <button class="step-prev-btn" @click="step = 1">
                <i class="bi bi-arrow-left me-1"></i> 이전
              </button>
              <button class="step-next-btn flex-1" @click="nextStep">
                다음 단계 <i class="bi bi-arrow-right ms-1"></i>
              </button>
            </div>
          </div>

          <!-- Step 3: 주문 확인 -->
          <div v-if="step === 3" class="step-block">
            <h2 class="step-title">주문 확인</h2>

            <!-- 배송지 -->
            <div class="confirm-address">
              <p class="confirm-address-title">배송지</p>
              <p class="confirm-address-info">{{ form.name }} · {{ form.phone }}</p>
              <p class="confirm-address-info">{{ form.address }} {{ form.addressDetail }}</p>
            </div>

            <!-- 상품 목록 -->
            <div class="confirm-item-list">
              <div v-for="item in store.cart" :key="item.key" class="confirm-item">
                <img :src="item.image" :alt="item.name" class="confirm-item-img" />
                <div class="confirm-item-info">
                  <p class="confirm-item-name">{{ item.name }}</p>
                  <p class="confirm-item-sub">{{ item.size }} / 수량: {{ item.qty }}</p>
                </div>
                <span class="confirm-item-price">
                  {{ (item.price * item.qty).toLocaleString() }}원
                </span>
              </div>
            </div>

            <div class="step-btn-row">
              <button class="step-prev-btn" @click="step = 2">
                <i class="bi bi-arrow-left me-1"></i> 이전
              </button>
              <button class="order-btn flex-1" @click="placeOrder">
                <i class="bi bi-lock me-1"></i> 결제 완료 ({{ totalWithShipping.toLocaleString() }}원)
              </button>
            </div>
          </div>

        </div>

        <!-- ===== 오른쪽: 주문 요약 ===== -->
        <div class="col-lg-5">
          <div class="order-summary">
            <p class="summary-label">ORDER SUMMARY</p>
            <h2 class="summary-title">주문 상품</h2>

            <div class="summary-divider"></div>

            <!-- 상품 목록 -->
            <div class="summary-item-list">
              <div v-for="item in store.cart" :key="item.key" class="summary-item">
                <img :src="item.image" :alt="item.name" class="summary-item-img" />
                <div class="summary-item-info">
                  <p class="summary-item-name">{{ item.name }}</p>
                  <p class="summary-item-sub">{{ item.size }} · x{{ item.qty }}</p>
                </div>
                <span class="summary-item-price">
                  {{ (item.price * item.qty).toLocaleString() }}원
                </span>
              </div>
            </div>

            <div class="summary-divider"></div>

            <div class="summary-row">
              <span>상품 금액</span>
              <span>{{ store.cartTotal.toLocaleString() }}원</span>
            </div>
            <div class="summary-row">
              <span>배송비</span>
              <span :class="{ 'free-ship': shippingFree }">
                {{ shippingFree ? '무료' : '3,000원' }}
              </span>
            </div>

            <div class="summary-divider"></div>

            <div class="summary-total">
              <span>총 결제금액</span>
              <span>{{ totalWithShipping.toLocaleString() }}원</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useShopStore } from '@/store/shop'

const store = useShopStore()
const router = useRouter()
const step = ref(1)

const form = ref({
  name: '', phone: '', email: '',
  zipcode: '', address: '', addressDetail: '',
  memo: '', payment: 'card'
})

const paymentMethods = [
  { value: 'card',  label: '신용카드 / 체크카드', icon: 'bi-credit-card' },
  { value: 'kakao', label: '카카오페이',           icon: 'bi-phone' },
  { value: 'naver', label: '네이버페이',           icon: 'bi-n-circle' },
  { value: 'bank',  label: '계좌이체',             icon: 'bi-bank' }
]

const shippingFree = computed(() => store.cartTotal >= 50000)
const totalWithShipping = computed(() =>
  store.cartTotal + (shippingFree.value ? 0 : 3000)
)

function nextStep() {
  if (step.value === 1 && (!form.value.name || !form.value.phone || !form.value.address)) {
    store.showToast('배송 정보를 모두 입력해주세요.', 'error')
    return
  }
  step.value++
}

function placeOrder() {
  store.clearCart()
  router.push('/order-complete')
}
</script>

<style scoped>
/* ===== 페이지 ===== */
.checkout-page {
  padding: 48px 0 80px;
}

/* ===== 헤더 ===== */
.checkout-header {
  margin-bottom: 32px;
}

.checkout-label {
  font-size: 11px;
  letter-spacing: 0.2em;
  color: #888;
  margin-bottom: 4px;
}

.checkout-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 40px;
  letter-spacing: 0.08em;
  color: #f2f0eb;
  margin: 0;
}

/* ===== 스텝 인디케이터 ===== */
.step-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  letter-spacing: 0.05em;
  color: #555;
  margin-bottom: 40px;
}

.step-indicator span { color: #555; }
.step-indicator span.active { color: #f2f0eb; }
.step-indicator i { font-size: 10px; color: #444; }

/* ===== 빈 상태 ===== */
.empty-state {
  text-align: center;
  padding: 80px 0;
  color: #888;
}

.empty-state p { margin-bottom: 20px; font-size: 14px; }

.empty-btn {
  display: inline-block;
  padding: 12px 32px;
  background: #f2f0eb;
  color: #0d0d0d;
  font-size: 12px;
  letter-spacing: 0.1em;
  text-decoration: none;
}

/* ===== 스텝 블록 ===== */
.step-block {
  background: #111;
  border: 1px solid rgba(255,255,255,0.06);
  padding: 28px;
}

.step-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 24px;
  letter-spacing: 0.08em;
  color: #f2f0eb;
  margin-bottom: 24px;
}

/* ===== 인풋 ===== */
.form-label-custom {
  display: block;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 6px;
}

.input-custom {
  width: 100%;
  background: #0d0d0d;
  border: 1px solid rgba(255,255,255,0.12);
  color: #f2f0eb;
  padding: 10px 14px;
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  outline: none;
  transition: border-color 0.2s;
  appearance: none;
}

.input-custom:focus {
  border-color: rgba(255,255,255,0.4);
}

.input-custom::placeholder { color: #555; }

.input-custom option {
  background: #0d0d0d;
  color: #f2f0eb;
}

/* ===== 결제 수단 ===== */
.payment-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
}

.payment-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid rgba(255,255,255,0.1);
  cursor: pointer;
  font-size: 13px;
  color: #888;
  transition: all 0.2s;
}

.payment-item input { display: none; }

.payment-item.active {
  border-color: #f2f0eb;
  color: #f2f0eb;
}

.payment-item i { font-size: 18px; }

/* ===== 버튼 ===== */
.step-next-btn {
  width: 100%;
  padding: 14px;
  background: #f2f0eb;
  color: #0d0d0d;
  border: none;
  font-size: 12px;
  letter-spacing: 0.12em;
  cursor: pointer;
  margin-top: 24px;
  transition: opacity 0.2s;
}

.step-next-btn:hover { opacity: 0.85; }

.step-btn-row {
  display: flex;
  gap: 8px;
  margin-top: 24px;
}

.step-prev-btn {
  padding: 14px 20px;
  background: transparent;
  color: #888;
  border: 1px solid rgba(255,255,255,0.12);
  font-size: 12px;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.step-prev-btn:hover {
  border-color: #f2f0eb;
  color: #f2f0eb;
}

.flex-1 { flex: 1; margin-top: 0; }

.order-btn {
  flex: 1;
  padding: 14px;
  background: #f2f0eb;
  color: #0d0d0d;
  border: none;
  font-size: 12px;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: opacity 0.2s;
}

.order-btn:hover { opacity: 0.85; }

/* ===== 주문 확인 ===== */
.confirm-address {
  background: #161616;
  border: 1px solid rgba(255,255,255,0.06);
  padding: 16px;
  margin-bottom: 20px;
}

.confirm-address-title {
  font-size: 11px;
  letter-spacing: 0.15em;
  color: #888;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.confirm-address-info {
  font-size: 13px;
  color: #aaa;
  margin: 0;
}

.confirm-item-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.confirm-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.confirm-item-img {
  width: 56px;
  height: 68px;
  object-fit: cover;
  background: #1a1a1a;
  flex-shrink: 0;
}

.confirm-item-info { flex: 1; }

.confirm-item-name {
  font-size: 13px;
  color: #f2f0eb;
  margin-bottom: 2px;
}

.confirm-item-sub {
  font-size: 12px;
  color: #666;
  margin: 0;
}

.confirm-item-price {
  font-size: 13px;
  color: #f2f0eb;
}

/* ===== 주문 요약 ===== */
.order-summary {
  background: #111;
  border: 1px solid rgba(255,255,255,0.06);
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
  font-family: 'Bebas Neue', sans-serif;
  font-size: 24px;
  letter-spacing: 0.08em;
  color: #f2f0eb;
  margin: 0;
}

.summary-divider {
  height: 1px;
  background: rgba(255,255,255,0.08);
  margin: 16px 0;
}

.summary-item-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 280px;
  overflow-y: auto;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.summary-item-img {
  width: 44px;
  height: 54px;
  object-fit: cover;
  background: #1a1a1a;
  flex-shrink: 0;
}

.summary-item-info { flex: 1; }

.summary-item-name {
  font-size: 12px;
  color: #f2f0eb;
  margin-bottom: 2px;
}

.summary-item-sub {
  font-size: 11px;
  color: #666;
  margin: 0;
}

.summary-item-price {
  font-size: 12px;
  color: #f2f0eb;
  white-space: nowrap;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #888;
  margin-bottom: 8px;
}

.free-ship { color: #b8a898; }

.summary-total {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  color: #f2f0eb;
}

/* ===== 모바일 ===== */
@media (max-width: 768px) {
  .checkout-page { padding: 32px 0 60px; }
  .step-indicator { flex-wrap: wrap; gap: 4px; }
}
</style>