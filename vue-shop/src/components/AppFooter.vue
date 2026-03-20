<template>
  <!-- 하단 푸터 -->
  <footer class="app-footer">
    <div class="footer-inner">

      <!-- 브랜드명 -->
      <div class="footer-logo">GENTLE MONSTER</div>

      <!-- 푸터 링크 -->
      <div class="footer-links">
        <a href="#">About</a>
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
        <a href="#">Contact</a>
      </div>

      <!-- 카피라이트 -->
      <p class="footer-copy">© 2025 GENTLE MONSTER. All rights reserved.</p>

    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.app-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 40px 24px;
}

.footer-inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

/* 푸터 로고 */
.footer-logo {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 30px;
  letter-spacing: 0.3em;
  color: #f2f0eb;
}

/* 푸터 링크 */
.footer-links {
  display: flex;
  gap: 24px;
}

.footer-links a {
  font-size: 11px;
  letter-spacing: 0.1em;
  color: #888;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #f2f0eb;
}

/* 카피라이트 */
.footer-copy {
  font-size: 11px;
  color: #555;
  letter-spacing: 0.05em;
}
</style>