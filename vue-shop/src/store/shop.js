import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useShopStore = defineStore('shop', () => {

  // ===== State =====
  const products       = ref([])
  const categories     = ref([])
  const banners        = ref([])
  const loading        = ref(false)
  const cart           = ref([])
  const wishlist       = ref([])
  const toast          = ref({ show: false, message: '', type: 'success' })
  const showLoginModal = ref(false)

  // ===== 유저 상태 =====
  const user = ref(JSON.parse(localStorage.getItem('gm_user') || 'null'))

  // 로그인 여부
  const isLoggedIn = computed(() => !!user.value)
  // 관리자 여부
  const isAdmin    = computed(() => user.value?.role === 'admin')

  // 로그인
  function login(userData) {
    user.value = userData
    localStorage.setItem('gm_user', JSON.stringify(userData))
    showToast(`${userData.name}님, 환영합니다.`)
    loadCart()
  }

  // 로그아웃 - 장바구니 초기화 후 홈으로 이동
  function logout() {
    user.value = null
    localStorage.removeItem('gm_user')
    cart.value = []
    showToast('로그아웃 되었습니다.')
    window.location.href = '/web03/'
  }

  // 회원가입 (로컬스토리지 기반)
  function register(userData) {
    const users = JSON.parse(localStorage.getItem('gm_users') || '[]')
    if (users.find(u => u.email === userData.email)) {
      return { success: false, message: '이미 사용중인 이메일입니다.' }
    }
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
  const API_URL = import.meta.env.VITE_API_URL

 // ===== 데이터 fetch =====
async function fetchData() {
  loading.value = true
  try {
    const res  = await fetch(import.meta.env.BASE_URL + 'products.json')
    const data = await res.json()
    categories.value = data.categories
    banners.value    = data.banners

    // DB 상품 + 리뷰 병렬 로드
    const [itemRes, reviewRes] = await Promise.all([
      fetch('/api/item'),
      fetch('/api/review/all')
    ])
    const items      = await itemRes.json()
    const allReviews = await reviewRes.json()

    // 상품별 평균 별점 계산 함수
    const calcAvgRating = (itemId) => {
      const rs = allReviews.filter(r => Number(r.itemId) === Number(itemId))
      return rs.length > 0 ? rs.reduce((sum, r) => sum + r.rating, 0) / rs.length : 0
    }

   // products.json 상품에 DB 데이터 합치기
const jsonProducts = data.products.map(product => {
  const dbItem    = items.find(i => Number(i.id) === Number(product.id))
  const avgRating = calcAvgRating(product.id)
  if (dbItem) {
    // detailsJson 파싱 → details 객체로 변환
    let details = product.details || {}
    if (dbItem.detailsJson) {
      try { details = JSON.parse(dbItem.detailsJson) } catch (e) {}
    }
    return {
      ...product,
      stock:        dbItem.stock,
      discountRate: dbItem.discountRate,
      price:        dbItem.price,
      category:     dbItem.category || product.category,
      badge:        dbItem.badge    || product.badge,
      description:  dbItem.description || product.description,
      details,
      avgRating
    }
  }
  return { ...product, avgRating }
})

    // DB에만 있는 신규 등록 상품
    const jsonIds = data.products.map(p => Number(p.id))
   const dbOnly = items
  .filter(i => !jsonIds.includes(Number(i.id)))
  .map(i => {
    // detailsJson 파싱
    let details = {}
    if (i.detailsJson) {
      try { details = JSON.parse(i.detailsJson) } catch (e) {}
    }
    return {
      id:           Number(i.id),
      name:         i.name,
      category:     i.category || 'all',
      price:        i.price,
      stock:        i.stock,
      discountRate: i.discountRate,
      description:  i.description || '',
      badge:        i.badge || 'NEW',
      images:       [i.imagePath || ''],
      colors:       ['#1A1A1A'],
      sizes:        ['FREE'],
      tags:         [],
      colorProducts: {},
      details,
      avgRating:    calcAvgRating(i.id)
    }
  })

    products.value = [...jsonProducts, ...dbOnly]
  } catch (e) {
    console.error('데이터를 가져오지 못했습니다.', e)
  } finally {
    loading.value = false
  }
}

  // ===== Computed =====
  // 장바구니 총 수량
  const cartCount = computed(() =>
    cart.value.reduce((sum, i) => sum + i.qty, 0)
  )

  // 장바구니 총 금액 (DB 상품 가격 기준)
  const cartTotal = computed(() =>
    cart.value.reduce((sum, item) => {
      const product = products.value.find(p => p.id === item.itemId)
      return sum + (product?.price || 0) * item.qty
    }, 0)
  )

  // 위시리스트 수량
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

  // 장바구니 목록 불러오기 (DB에서)
  async function loadCart() {
    if (!user.value?.loginId) return
    try {
      const res  = await fetch(`/api/cart/${user.value.loginId}`)
      const data = await res.json()
      cart.value = data.map(item => ({
        id:     item.id,
        itemId: item.itemId,
        qty:    item.quantity,
        key:    `${item.itemId}`,
        color:  item.color,
        size:   item.size
      }))
    } catch (e) {
      console.error(e)
    }
  }

  // 장바구니 추가 (비로그인 시 로그인 모달 표시)
  async function addToCart(product, qty = 1, color = null, size = null) {
    if (!user.value?.loginId) {
      showLoginModal.value = true
      return
    }
    try {
      const res  = await fetch('/api/cart', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          loginId:  user.value.loginId,
          itemId:   product.id,
          quantity: qty,
          color,
          size
        })
      })
      const data = await res.json()
      if (data.success) {
        showToast('장바구니에 추가했습니다.')
        loadCart()
      }
    } catch (e) {
      showToast('오류가 발생했습니다.', 'error')
    }
  }

  // 장바구니 수량 변경
  async function updateCartQty(id, quantity) {
    try {
      await fetch(`/api/cart/${id}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ quantity })
      })
      loadCart()
    } catch (e) {
      console.error(e)
    }
  }

  // 장바구니 개별 삭제
  async function removeFromCart(id) {
    try {
      await fetch(`/api/cart/${id}`, { method: 'DELETE' })
      loadCart()
    } catch (e) {
      console.error(e)
    }
  }

  // 장바구니 전체 삭제 (주문 완료 후)
  async function clearCart() {
    if (!user.value?.loginId) return
    try {
      await fetch(`/api/cart/clear/${user.value.loginId}`, { method: 'DELETE' })
      cart.value = []
    } catch (e) {
      console.error(e)
    }
  }

  // ===== 토스트 알림 =====
  function showToast(message, type = 'success') {
    toast.value = { show: true, message, type }
    setTimeout(() => { toast.value.show = false }, 2000)
  }

  // ===== 상품 조회 =====
  function getProductById(id) {
    return products.value.find(p => p.id === Number(id))
  }

  // 새로고침 시 로그인 상태면 장바구니 불러오기
  if (user.value?.loginId) {
    loadCart()
  }

  return {
    products, categories, banners, loading,
    cart, wishlist, toast,
    showLoginModal,
    user, isLoggedIn, isAdmin,
    cartCount, cartTotal, wishlistCount,
    login, logout, register,
    isInWishlist, toggleWishlist,
    loadCart, addToCart, updateCartQty, removeFromCart, clearCart,
    showToast,
    getProductById,
    fetchData
  }
})