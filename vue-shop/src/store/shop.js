import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useShopStore = defineStore('shop', () => {

  // ===== State =====
  const products    = ref([])
  const categories  = ref([])
  const banners     = ref([])
  const reviews     = ref([])
  const loading     = ref(false)
  const cart        = ref([])
  const wishlist    = ref([])
  const toast       = ref({ show: false, message: '', type: 'success' })

  // ===== 유저 상태 =====
  const user = ref(JSON.parse(localStorage.getItem('gm_user') || 'null'))

  const isLoggedIn = computed(() => !!user.value)
  const isAdmin    = computed(() => user.value?.role === 'admin')

  function login(userData) {
    user.value = userData
    localStorage.setItem('gm_user', JSON.stringify(userData))
    showToast(`${userData.name}님, 환영합니다.`)
  }

  function logout() {
    user.value = null
    localStorage.removeItem('gm_user')
    showToast('로그아웃 되었습니다.')
  }

  function register(userData) {
    // 기존 회원 목록 가져오기
    const users = JSON.parse(localStorage.getItem('gm_users') || '[]')
    // 이메일 중복 체크
    if (users.find(u => u.email === userData.email)) {
      return { success: false, message: '이미 사용중인 이메일입니다.' }
    }
    // 새 유저 추가
    const newUser = {
      ...userData,
      id: Date.now(),
      role: 'user',
      level: 1,
      createdAt: new Date().toISOString().slice(0, 10)
    }
    users.push(newUser)
    localStorage.setItem('gm_users', JSON.stringify(users))
    return { success: true }
  }

  // ===== API Base URL =====
  // Spring Boot 연동 시 .env 파일에서 VITE_API_URL=http://localhost:8080/api 설정
  // 미설정 시 기존 products.json 사용 (로컬 개발)
  const API_URL = import.meta.env.VITE_API_URL

  // ===== 데이터 fetch (Spring Boot 또는 로컬 JSON) =====
  async function fetchData() {
    loading.value = true
    try {
      if (API_URL) {
        // Spring Boot 연동 모드 - 엔드포인트별 개별 요청
        const [productsRes, categoriesRes, bannersRes, reviewsRes] = await Promise.all([
          fetch(`${API_URL}/products`),
          fetch(`${API_URL}/categories`),
          fetch(`${API_URL}/banners`),
          fetch(`${API_URL}/reviews`)
        ])
        products.value   = await productsRes.json()
        categories.value = await categoriesRes.json()
        banners.value    = await bannersRes.json()
        reviews.value    = await reviewsRes.json()
      } else {
        // 로컬 JSON 모드 (기존 방식 유지)
        const res  = await fetch(import.meta.env.BASE_URL + 'products.json')
        const data = await res.json()
        products.value   = data.products
        categories.value = data.categories
        banners.value    = data.banners
        reviews.value    = data.reviews
      }
    } catch (e) {
      console.error('데이터를 가져오지 못했습니다.', e)
    } finally {
      loading.value = false
    }
  }

  // ===== Computed =====
  const cartCount     = computed(() => cart.value.reduce((sum, i) => sum + i.qty, 0))
  const cartTotal     = computed(() => cart.value.reduce((sum, i) => sum + i.price * i.qty, 0))
  const wishlistCount = computed(() => wishlist.value.length)

  // ===== 위시리스트 =====
  function isInWishlist(productId) {
    return wishlist.value.some(item => item.id === productId)
  }

  function toggleWishlist(product) {
    const index = wishlist.value.findIndex(item => item.id === product.id)
    if (index > -1) {
      wishlist.value.splice(index, 1)
      showToast('위시리스트에서 제거했습니다.')
    } else {
      wishlist.value.push(product)
      showToast('위시리스트에 추가했습니다.')
    }
  }

  // ===== 장바구니 =====
  function addToCart(product, qty = 1, color = null, size = null) {
    const key = `${product.id}-${color || ''}-${size || ''}`
    const item = cart.value.find(i => i.key === key)
    if (item) {
      item.qty += qty
    } else {
      cart.value.push({
        ...product,
        key,
        qty,
        color,
        size,
        image: product.images?.[0] || ''
      })
    }
    showToast('장바구니에 추가했습니다.')
  }

  function updateCartQty(key, delta) {
    const item = cart.value.find(i => i.key === key)
    if (!item) return
    item.qty += delta
    if (item.qty <= 0) removeFromCart(key)
  }

  function removeFromCart(key) {
    const index = cart.value.findIndex(i => i.key === key)
    if (index > -1) cart.value.splice(index, 1)
  }

  function clearCart() {
    cart.value = []
  }

  // ===== 토스트 =====
  function showToast(message, type = 'success') {
    toast.value = { show: true, message, type }
    setTimeout(() => { toast.value.show = false }, 2000)
  }

  // ===== 상품 조회 =====
  function getProductById(id) {
    return products.value.find(p => p.id === Number(id))
  }

  function getReviewsByProductId(id) {
    return reviews.value.filter(r => r.productId === Number(id))
  }

  return {
    products, categories, banners, reviews, loading,
    cart, wishlist, toast,
    user, isLoggedIn, isAdmin,
    cartCount, cartTotal, wishlistCount,
    login, logout, register,
    isInWishlist, toggleWishlist,
    addToCart, updateCartQty, removeFromCart, clearCart,
    showToast,
    getProductById, getReviewsByProductId,
    fetchData
  }
})