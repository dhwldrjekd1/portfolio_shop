<template>
  <header class="app-header">
    <div class="header-inner">

      <!-- 왼쪽: 카테고리 메뉴 -->
      <nav class="header-nav">
        <RouterLink to="/" :class="{ 'nav-active': route.path === '/' }">홈</RouterLink>
        <RouterLink to="/products?category=sunglasses" :class="{ 'nav-active': isSunglasses }">선글라스</RouterLink>
        <RouterLink to="/products?category=eyeglasses" :class="{ 'nav-active': isEyeglasses }">안경</RouterLink>
        <RouterLink to="/collections" :class="{ 'nav-active': route.path === '/collections' }">컬렉션</RouterLink>
        <RouterLink to="/board" :class="{ 'nav-active': route.path === '/board' }">고객지원</RouterLink>
      </nav>

      <!-- 가운데: 브랜드 로고 -->
      <RouterLink to="/" class="header-logo">
        GENTLE MONSTER
      </RouterLink>

      <!-- 오른쪽: 아이콘 메뉴 -->
      <div class="header-icons">
        <RouterLink to="/products">
          <i class="bi bi-search"></i>
        </RouterLink>
        <RouterLink to="/wishlist" class="icon-wrap">
          <i class="bi bi-heart"></i>
          <span v-if="store.wishlistCount > 0" class="icon-count">
            {{ store.wishlistCount }}
          </span>
        </RouterLink>
        <RouterLink to="/cart" class="icon-wrap">
          <i class="bi bi-bag"></i>
          <span v-if="store.cartCount > 0" class="icon-count">
            {{ store.cartCount }}
          </span>
        </RouterLink>

        <!-- 로그인/회원가입 버튼 -->
        <div class="auth-wrap">
          <button class="auth-icon" @click="toggleAuthModal">
            <i class="bi bi-person"></i>
          </button>
        </div>
      </div>

    </div>
  </header>

  <!-- ===== 로그인/회원가입 모달 ===== -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
        <div class="modal-box">

          <!-- 닫기 버튼 -->
          <button class="modal-close" @click="closeModal">
            <i class="bi bi-x"></i>
          </button>

          <!-- 탭 -->
          <div class="modal-tabs">
            <button
              class="modal-tab"
              :class="{ active: modalTab === 'login' }"
              @click="modalTab = 'login'"
            >
              로그인
            </button>
            <button
              class="modal-tab"
              :class="{ active: modalTab === 'register' }"
              @click="modalTab = 'register'"
            >
              회원가입
            </button>
          </div>

          <!-- ===== 로그인 폼 ===== -->
          <div v-if="modalTab === 'login'" class="modal-form">
            <p class="modal-title">WELCOME BACK</p>

            <div class="form-group">
              <label class="form-label-custom">이메일</label>
              <input
                v-model="loginForm.email"
                type="email"
                class="input-custom"
                placeholder="example@email.com"
              />
            </div>
            <div class="form-group">
              <label class="form-label-custom">비밀번호</label>
              <input
                v-model="loginForm.password"
                type="password"
                class="input-custom"
                placeholder="비밀번호 입력"
              />
            </div>

            <div class="form-options">
              <label class="remember-wrap">
                <input type="checkbox" v-model="loginForm.remember" />
                <span>로그인 상태 유지</span>
              </label>
              <button class="forgot-btn">비밀번호 찾기</button>
            </div>

            <button class="submit-btn" @click="handleLogin">
              로그인
            </button>

            <p class="modal-switch">
              계정이 없으신가요?
              <button @click="modalTab = 'register'">회원가입</button>
            </p>
          </div>

          <!-- ===== 회원가입 폼 ===== -->
          <div v-if="modalTab === 'register'" class="modal-form">
            <p class="modal-title">CREATE ACCOUNT</p>

            <div class="form-group">
              <label class="form-label-custom">이름</label>
              <input
                v-model="registerForm.name"
                type="text"
                class="input-custom"
                placeholder="홍길동"
              />
            </div>
            <div class="form-group">
              <label class="form-label-custom">이메일</label>
              <input
                v-model="registerForm.email"
                type="email"
                class="input-custom"
                placeholder="example@email.com"
              />
            </div>
            <div class="form-group">
              <label class="form-label-custom">비밀번호</label>
              <input
                v-model="registerForm.password"
                type="password"
                class="input-custom"
                placeholder="8자 이상 입력"
              />
            </div>
            <div class="form-group">
              <label class="form-label-custom">비밀번호 확인</label>
              <input
                v-model="registerForm.passwordConfirm"
                type="password"
                class="input-custom"
                placeholder="비밀번호 재입력"
              />
            </div>

            <label class="agree-wrap">
              <input type="checkbox" v-model="registerForm.agree" />
              <span>이용약관 및 개인정보처리방침에 동의합니다.</span>
            </label>

            <button class="submit-btn" @click="handleRegister">
              회원가입
            </button>

            <p class="modal-switch">
              이미 계정이 있으신가요?
              <button @click="modalTab = 'login'">로그인</button>
            </p>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useShopStore } from '@/store/shop'

const store = useShopStore()
const route = useRoute()

// ===== 네비 활성화 (호버 버그 수정) =====
// /products?category=xxx 형태라 path만으로는 구분 안 되므로 query까지 비교
const isSunglasses = computed(() =>
  route.path === '/products' && route.query.category === 'sunglasses'
)
const isEyeglasses = computed(() =>
  route.path === '/products' && route.query.category === 'eyeglasses'
)

// 모달 상태
const showModal = ref(false)
const modalTab  = ref('login')

function toggleAuthModal() {
  showModal.value = !showModal.value
}

function closeModal() {
  showModal.value = false
}

// 로그인 폼
const loginForm = ref({
  email: '', password: '', remember: false
})

// 회원가입 폼
const registerForm = ref({
  name: '', email: '', password: '', passwordConfirm: '', agree: false
})

// 로그인 처리 (백엔드 연동 전 임시)
function handleLogin() {
  if (!loginForm.value.email || !loginForm.value.password) {
    store.showToast('이메일과 비밀번호를 입력해주세요.', 'error')
    return
  }
  store.showToast('로그인되었습니다.')
  closeModal()
}

// 회원가입 처리 (백엔드 연동 전 임시)
function handleRegister() {
  if (!registerForm.value.name || !registerForm.value.email || !registerForm.value.password) {
    store.showToast('모든 항목을 입력해주세요.', 'error')
    return
  }
  if (registerForm.value.password !== registerForm.value.passwordConfirm) {
    store.showToast('비밀번호가 일치하지 않습니다.', 'error')
    return
  }
  if (!registerForm.value.agree) {
    store.showToast('약관에 동의해주세요.', 'error')
    return
  }
  store.showToast('회원가입이 완료되었습니다.')
  modalTab.value = 'login'
}
</script>

<style scoped>
/* ===== 헤더 ===== */
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #0d0d0d;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  height: 60px;
  position: relative;
}

/* 왼쪽 네비 */
.header-nav {
  display: flex;
  gap: 24px;
  z-index: 1;
}

.header-nav a {
  font-size: 13px;
  letter-spacing: 0.12em;
  color: #888;
  text-decoration: none;
  transition: color 0.2s;
  white-space: nowrap;
}

.header-nav a:hover,
.header-nav a.nav-active {
  color: #f2f0eb;
}

/* 로고 */
.header-logo {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 40px;
  letter-spacing: 0.25em;
  color: #f2f0eb;
  text-decoration: none;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
}

/* 오른쪽 아이콘 */
.header-icons {
  display: flex;
  align-items: center;
  gap: 20px;
  z-index: 1;
}

.header-icons a {
  color: #f2f0eb;
  font-size: 16px;
  text-decoration: none;
  transition: opacity 0.2s;
}

.header-icons a:hover { opacity: 0.7; }

.icon-wrap { position: relative; }

.icon-count {
  position: absolute;
  top: -6px;
  right: -8px;
  background: #b8a898;
  color: #0d0d0d;
  font-size: 9px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

/* 로그인 버튼 */
.auth-icon {
  background: none;
  border: none;
  color: #f2f0eb;
  font-size: 16px;
  cursor: pointer;
  padding: 0;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
}

.auth-icon:hover { opacity: 0.7; }

/* 모바일 */
@media (max-width: 768px) {
  .header-nav { display: none; }
  .header-logo { font-size: 18px; }
}

/* ===== 모달 ===== */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal-box {
  background: #0d0d0d;
  border: 1px solid rgba(255,255,255,0.1);
  width: 100%;
  max-width: 400px;
  padding: 36px 32px 32px;
  position: relative;
}

/* 닫기 */
.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: #888;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}

.modal-close:hover { color: #f2f0eb; }

/* 탭 */
.modal-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  margin-bottom: 28px;
}

.modal-tab {
  flex: 1;
  padding: 10px;
  font-size: 12px;
  letter-spacing: 0.1em;
  color: #666;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: -1px;
}

.modal-tab:hover { color: #f2f0eb; }

.modal-tab.active {
  color: #f2f0eb;
  border-bottom-color: #f2f0eb;
}

/* 폼 */
.modal-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 22px;
  letter-spacing: 0.12em;
  color: #f2f0eb;
  margin-bottom: 20px;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.form-group {
  margin-bottom: 14px;
}

.form-label-custom {
  display: block;
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 6px;
}

.input-custom {
  width: 100%;
  background: #111;
  border: 1px solid rgba(255,255,255,0.1);
  color: #f2f0eb;
  padding: 10px 12px;
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  outline: none;
  transition: border-color 0.2s;
}

.input-custom:focus {
  border-color: rgba(255,255,255,0.35);
}

.input-custom::placeholder { color: #555; }

/* 로그인 옵션 */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 4px;
}

.remember-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #888;
  cursor: pointer;
}

.remember-wrap input { accent-color: #b8a898; }

.forgot-btn {
  background: none;
  border: none;
  font-size: 12px;
  color: #888;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}

.forgot-btn:hover { color: #f2f0eb; }

/* 동의 체크 */
.agree-wrap {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12px;
  color: #888;
  cursor: pointer;
  margin-bottom: 20px;
  margin-top: 4px;
  line-height: 1.5;
}

.agree-wrap input { accent-color: #b8a898; margin-top: 2px; flex-shrink: 0; }

/* 제출 버튼 */
.submit-btn {
  width: 100%;
  padding: 13px;
  background: #f2f0eb;
  color: #0d0d0d;
  border: none;
  font-size: 12px;
  letter-spacing: 0.12em;
  cursor: pointer;
  transition: opacity 0.2s;
  margin-bottom: 16px;
}

.submit-btn:hover { opacity: 0.85; }

/* 하단 전환 */
.modal-switch {
  text-align: center;
  font-size: 12px;
  color: #666;
  margin: 0;
}

.modal-switch button {
  background: none;
  border: none;
  color: #b8a898;
  font-size: 12px;
  cursor: pointer;
  padding: 0;
  margin-left: 4px;
  text-decoration: underline;
  transition: color 0.2s;
}

.modal-switch button:hover { color: #f2f0eb; }

/* 모달 애니메이션 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>