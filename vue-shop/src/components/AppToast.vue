<template>
  <!-- 토스트 알림 (장바구니 추가 등) -->
  <Transition name="toast">
    <div v-if="store.toast.show" class="app-toast">
      <i class="bi bi-check-circle"></i>
      {{ store.toast.message }}
    </div>
  </Transition>
</template>

<script setup>
import { useShopStore } from '@/store/shop'
const store = useShopStore()
</script>

<style scoped>
/* 토스트 위치 - 오른쪽 하단 */
.app-toast {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: #f2f0eb;
  color: #0d0d0d;
  padding: 12px 20px;
  font-size: 13px;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 9999;
}

/* 토스트 애니메이션 */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>