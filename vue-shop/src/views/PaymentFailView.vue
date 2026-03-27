<template>
  <div style="text-align: center; padding: 80px 0">
    <div style="font-size: 48px; color: #c0392b; margin-bottom: 24px">✕</div>
    <h1
      style="
        font-family: 'Bebas Neue', sans-serif;
        font-size: 40px;
        color: #f2f0eb;
        margin-bottom: 16px;
      "
    >
      결제 실패
    </h1>
    <p style="color: #888; margin-bottom: 8px">{{ message }}</p>
    <p style="color: #666; font-size: 12px; margin-bottom: 32px">{{ code }}</p>
    <RouterLink
      to="/checkout"
      style="
        display: inline-block;
        padding: 12px 32px;
        background: #f2f0eb;
        color: #0d0d0d;
        font-size: 12px;
        text-decoration: none;
      "
    >
      다시 시도하기
    </RouterLink>
  </div>
</template>

<script setup>
import { ref } from "vue";

const params = new URLSearchParams(window.location.search);
const message = ref(params.get("message") || "결제에 실패했습니다.");
const code = ref(params.get("code") || "");
</script>
