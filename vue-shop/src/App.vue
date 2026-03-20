<template>
  <div>
    <AppHeader />
    <main style="min-height: 80vh;">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <AppFooter />
    <AppToast />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useShopStore } from '@/store/shop'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import AppToast from '@/components/AppToast.vue'

const store = useShopStore()
onMounted(() => store.fetchData())
</script>

<style>
/* ===================================================
   CSS 변수
=================================================== */
:root {
  --black:      #0d0d0d;
  --white:      #f2f0eb;
  --gray:       #888888;
  --accent:     #b8a898;
  --border:     rgba(255, 255, 255, 0.08);
  --font-title: 'Bebas Neue', sans-serif;
  --font-serif: 'Cormorant Garamond', serif;
  --font-body:  'DM Sans', sans-serif;
}

/* ===================================================
   리셋
=================================================== */
*, *::before, *::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  font-size: 16px;
}

body {
  margin: 0;
  padding: 0;
  background-color: #0d0d0d !important;
  color: #f2f0eb !important;
  font-family: 'DM Sans', sans-serif !important;
  font-weight: 300 !important;
  font-size: 16px !important;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

/* ===================================================
   Bootstrap 핵심 충돌만 최소한으로 재정의
=================================================== */
/* Bootstrap 배경 흰색 덮어씌우기 */
.bg-light  { background-color: #1a1a1a !important; }
.bg-white  { background-color: #1a1a1a !important; }

/* Bootstrap 텍스트 색상 */
.text-muted  { color: #888 !important; }
.text-dark   { color: #f2f0eb !important; }

/* Bootstrap 테두리 색상 */
.border,
.border-top,
.border-bottom {
  border-color: rgba(255,255,255,0.08) !important;
}

/* ===================================================
   페이지 전환 애니메이션
=================================================== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ===================================================
   링크 / 버튼 기본
=================================================== */
a {
  color: inherit;
  text-decoration: none;
}

button {
  cursor: pointer;
  border: none;
  background: none;
  font-family: inherit;
}

/* ===================================================
   스크롤바
=================================================== */
::-webkit-scrollbar { width: 2px; }
::-webkit-scrollbar-track { background: #0d0d0d; }
::-webkit-scrollbar-thumb { background: #b8a898; }
</style>