<template>
  <div class="complete-page">
    <div class="complete-wrap">

      <!-- 체크 아이콘 -->
      <div class="check-icon">
        <i class="bi bi-check-lg"></i>
      </div>

      <!-- 타이틀 -->
      <p class="complete-label">ORDER COMPLETE</p>
      <h1 class="complete-title">주문 완료!</h1>
      <p class="complete-sub">주문이 성공적으로 접수되었습니다.</p>
      <p class="complete-num">주문 번호 <span>{{ orderNum }}</span></p>

      <div class="complete-divider"></div>

      <!-- 주문 안내 -->
      <div class="notice-box">
        <p class="notice-title">주문 안내</p>
        <ul class="notice-list">
          <li>
            <i class="bi bi-check-circle-fill"></i>
            <span>입력하신 이메일로 주문 확인서가 발송됩니다.</span>
          </li>
          <li>
            <i class="bi bi-check-circle-fill"></i>
            <span>오늘 주문하신 상품은 내일 배송 예정입니다.</span>
          </li>
          <li>
            <i class="bi bi-check-circle-fill"></i>
            <span>배송 시작 시 문자로 안내 드립니다.</span>
          </li>
        </ul>
      </div>

      <!-- 버튼 -->
      <div class="complete-btns">
        <RouterLink to="/" class="btn-outline-custom">홈으로</RouterLink>
        <RouterLink to="/products" class="btn-fill-custom">쇼핑 계속하기</RouterLink>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 랜덤 주문번호 생성
const orderNum = ref('LUXE-' + Math.random().toString(36).substr(2, 9).toUpperCase())
</script>

<style scoped>
/* ===== 페이지 ===== */
.complete-page {
  padding: 80px 0;
  display: flex;
  justify-content: center;
}

.complete-wrap {
  width: 100%;
  max-width: 480px;
  padding: 0 24px;
  text-align: center;
}

/* ===== 체크 아이콘 ===== */
.check-icon {
  width: 72px;
  height: 72px;
  background: #161616;
  border: 1px solid rgba(255,255,255,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 28px;
}

.check-icon i {
  font-size: 32px;
  color: #b8a898;
}

/* ===== 텍스트 ===== */
.complete-label {
  font-size: 11px;
  letter-spacing: 0.2em;
  color: #888;
  margin-bottom: 8px;
}

.complete-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 48px;
  letter-spacing: 0.08em;
  color: #f2f0eb;
  margin-bottom: 12px;
}

.complete-sub {
  font-size: 14px;
  color: #888;
  margin-bottom: 8px;
}

.complete-num {
  font-size: 13px;
  color: #666;
  margin: 0;
}

.complete-num span {
  color: #b8a898;
  letter-spacing: 0.1em;
}

/* ===== 구분선 ===== */
.complete-divider {
  height: 1px;
  background: rgba(255,255,255,0.08);
  margin: 28px 0;
}

/* ===== 안내 박스 ===== */
.notice-box {
  background: #111;
  border: 1px solid rgba(255,255,255,0.06);
  padding: 20px 24px;
  text-align: left;
  margin-bottom: 28px;
}

.notice-title {
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 14px;
}

.notice-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notice-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  color: #aaa;
}

.notice-list i {
  color: #b8a898;
  font-size: 13px;
  flex-shrink: 0;
  margin-top: 1px;
}

/* ===== 버튼 ===== */
.complete-btns {
  display: flex;
  gap: 8px;
}

.btn-outline-custom {
  flex: 1;
  display: block;
  text-align: center;
  padding: 13px;
  background: transparent;
  color: #888;
  border: 1px solid rgba(255,255,255,0.12);
  font-size: 12px;
  letter-spacing: 0.1em;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-outline-custom:hover {
  border-color: #f2f0eb;
  color: #f2f0eb;
}

.btn-fill-custom {
  flex: 1;
  display: block;
  text-align: center;
  padding: 13px;
  background: #f2f0eb;
  color: #0d0d0d;
  border: none;
  font-size: 12px;
  letter-spacing: 0.1em;
  text-decoration: none;
  transition: opacity 0.2s;
}

.btn-fill-custom:hover { opacity: 0.85; }

/* ===== 모바일 ===== */
@media (max-width: 768px) {
  .complete-page { padding: 48px 0; }
  .complete-title { font-size: 36px; }
}
</style>