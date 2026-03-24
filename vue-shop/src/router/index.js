import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { useShopStore } from '@/store/shop'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/products', name: 'products', component: () => import('@/views/ProductView.vue') },
  { path: '/product/:id', name: 'product', component: () => import('@/views/ProductDetailView.vue') },
  { path: '/cart', name: 'cart', component: () => import('@/views/CartView.vue') },
  { path: '/wishlist', name: 'wishlist', component: () => import('@/views/WishlistView.vue') },
  { path: '/checkout', name: 'checkout', component: () => import('@/views/CheckoutView.vue'), meta: { requiresAuth: true } },
  { path: '/order-complete', name: 'order-complete', component: () => import('@/views/OrderCompleteView.vue'), meta: { requiresAuth: true } },
  { path: '/collections', name: 'collections', component: () => import('@/views/CollectionView.vue') },
  { path: '/board', name: 'board', component: () => import('@/views/BoardView.vue') },
  { path: '/admin', name: 'admin', component: () => import('@/views/AdminView.vue'), meta: { requiresAdmin: true } },
  { path: '/community', name: 'community', component: () => import('@/views/CommunityView.vue') },
  { path: '/mypage', name: 'mypage', component: () => import('@/views/MyPageView.vue'), meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// 라우터 가드 - 페이지 접근 권한 체크
router.beforeEach((to, from, next) => {
  const store = useShopStore()

  // 관리자 전용 페이지 체크
  if (to.meta.requiresAdmin) {
    if (!store.isLoggedIn || !store.isAdmin) {
      next('/')
      return
    }
  }

  // 로그인 필요 페이지 체크
  if (to.meta.requiresAuth) {
    if (!store.isLoggedIn) {
      store.showLoginModal = true
      next('/')
      return
    }
  }

  next()
})

export default router