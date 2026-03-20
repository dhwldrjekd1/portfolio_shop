<template>
  <div class="board-page">
    <div class="container">

      <!-- 헤더 -->
      <div class="board-header">
        <p class="board-label">SUPPORT</p>
        <h1 class="board-title">고객 지원</h1>
      </div>

      <!-- 탭 -->
      <div class="board-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-btn"
          :class="{ active: currentTab === tab.id }"
          @click="currentTab = tab.id"
        >
          {{ tab.name }}
        </button>
      </div>

      <!-- ===== 공지사항 ===== -->
      <div v-if="currentTab === 'notice'">
        <div class="post-list">
          <div
            v-for="post in notices"
            :key="post.id"
            class="post-item"
            @click="togglePost(post)"
          >
            <div class="post-row">
              <span v-if="post.important" class="post-badge">중요</span>
              <span class="post-title">{{ post.title }}</span>
              <span class="post-date">{{ post.date }}</span>
              <i class="bi" :class="post.open ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
            </div>
            <div v-if="post.open" class="post-content">
              {{ post.content }}
            </div>
          </div>
        </div>
      </div>

      <!-- ===== FAQ ===== -->
      <div v-if="currentTab === 'faq'">
        <!-- FAQ 카테고리 -->
        <div class="faq-cats">
          <button
            v-for="cat in faqCategories"
            :key="cat"
            class="faq-cat-btn"
            :class="{ active: currentFaqCat === cat }"
            @click="currentFaqCat = cat"
          >
            {{ cat }}
          </button>
        </div>

        <div class="post-list">
          <div
            v-for="faq in filteredFaqs"
            :key="faq.id"
            class="post-item"
            @click="togglePost(faq)"
          >
            <div class="post-row">
              <span class="faq-q">Q</span>
              <span class="post-title">{{ faq.title }}</span>
              <i class="bi" :class="faq.open ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
            </div>
            <div v-if="faq.open" class="post-content">
              <span class="faq-a">A</span> {{ faq.content }}
            </div>
          </div>
        </div>
      </div>

      <!-- ===== 고객문의 ===== -->
      <div v-if="currentTab === 'inquiry'">

        <!-- 로그인 필요 안내 -->
        <div v-if="!store.isLoggedIn" class="login-required">
          <i class="bi bi-lock"></i>
          <p>고객문의는 로그인 후 이용 가능합니다.</p>
          <RouterLink to="/login" class="login-required-btn">로그인하기</RouterLink>
        </div>

        <!-- 문의 폼 -->
        <div v-else>
          <div class="inquiry-form">
            <div class="form-group">
              <label class="form-label-custom">문의 유형</label>
              <select v-model="inquiry.type" class="input-custom">
                <option value="">선택해주세요</option>
                <option>주문/결제</option>
                <option>배송/교환/반품</option>
                <option>상품 문의</option>
                <option>기타</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label-custom">제목</label>
              <input v-model="inquiry.title" type="text" class="input-custom" placeholder="문의 제목 입력" />
            </div>
            <div class="form-group">
              <label class="form-label-custom">내용</label>
              <textarea v-model="inquiry.content" class="textarea-custom" placeholder="문의 내용을 입력해주세요." rows="5"></textarea>
            </div>
            <button class="submit-btn" @click="submitInquiry">문의 접수</button>
          </div>

          <!-- 내 문의 내역 -->
          <div v-if="myInquiries.length > 0" class="my-inquiries">
            <h3 class="my-inquiry-title">내 문의 내역</h3>
            <div class="post-list">
              <div v-for="item in myInquiries" :key="item.id" class="post-item">
                <div class="post-row">
                  <span class="post-badge" :class="item.status === '답변완료' ? 'done' : ''">
                    {{ item.status }}
                  </span>
                  <span class="post-title">{{ item.title }}</span>
                  <span class="post-date">{{ item.date }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useShopStore } from '@/store/shop'

const store = useShopStore()

const tabs = [
  { id: 'notice',  name: '공지사항' },
  { id: 'faq',     name: 'FAQ' },
  { id: 'inquiry', name: '고객문의' }
]

const currentTab    = ref('notice')
const currentFaqCat = ref('전체')

// 공지사항 데이터
const notices = ref([
  { id: 1, important: true,  open: false, title: '[필독] 개인정보처리방침 개정 안내', date: '2025.03.01', content: '안녕하세요. GENTLE MONSTER입니다. 개인정보처리방침이 2025년 3월 1일부로 개정됩니다. 주요 변경사항은 개인정보 보관 기간 및 제3자 제공 항목입니다.' },
  { id: 2, important: true,  open: false, title: '2025 S/S 신제품 출시 안내', date: '2025.02.20', content: '2025 S/S 시즌 신제품이 출시되었습니다. MUSEE 시리즈 및 ROMA 컬렉션을 만나보세요.' },
  { id: 3, important: false, open: false, title: '설 연휴 배송 안내', date: '2025.01.15', content: '설 연휴 기간(1/28~2/2) 동안 배송이 지연될 수 있습니다. 양해 부탁드립니다.' },
  { id: 4, important: false, open: false, title: '시스템 점검 안내 (1/10 02:00~06:00)', date: '2025.01.08', content: '서비스 안정화를 위한 시스템 점검이 진행됩니다. 해당 시간에는 서비스 이용이 불가합니다.' }
])

// FAQ 데이터
const faqCategories = ['전체', '주문/결제', '배송', '교환/반품', '상품']

const faqs = ref([
  { id: 1, cat: '주문/결제', open: false, title: '주문 취소는 어떻게 하나요?', content: '주문 후 배송 준비 전까지 마이페이지에서 취소 가능합니다. 이미 배송이 시작된 경우 배송 완료 후 반품 처리해 주세요.' },
  { id: 2, cat: '주문/결제', open: false, title: '결제 수단은 어떤 것이 있나요?', content: '신용카드, 체크카드, 카카오페이, 네이버페이, 계좌이체를 지원합니다.' },
  { id: 3, cat: '배송',     open: false, title: '배송은 얼마나 걸리나요?', content: '주문 후 1~3 영업일 이내 출고되며, 출고 후 1~2일 내 수령 가능합니다. 제주/도서산간 지역은 추가 시간이 소요될 수 있습니다.' },
  { id: 4, cat: '배송',     open: false, title: '무료배송 기준이 어떻게 되나요?', content: '5만원 이상 구매 시 무료배송입니다. 5만원 미만의 경우 배송비 3,000원이 부과됩니다.' },
  { id: 5, cat: '교환/반품', open: false, title: '교환/반품 기간은 얼마나 되나요?', content: '수령 후 30일 이내 교환/반품 신청이 가능합니다. 단, 상품 훼손 또는 사용 흔적이 있는 경우 불가합니다.' },
  { id: 6, cat: '상품',     open: false, title: '제품 AS는 어떻게 받나요?', content: '구매 후 1년 이내 제품 불량의 경우 무상 AS가 가능합니다. 고객센터로 문의해 주세요.' }
])

const filteredFaqs = computed(() => {
  if (currentFaqCat.value === '전체') return faqs.value
  return faqs.value.filter(f => f.cat === currentFaqCat.value)
})

// 고객문의
const inquiry = ref({ type: '', title: '', content: '' })
const myInquiries = ref([])

function togglePost(post) {
  post.open = !post.open
}

function submitInquiry() {
  if (!inquiry.value.type || !inquiry.value.title || !inquiry.value.content) {
    return
  }
  myInquiries.value.unshift({
    id: Date.now(),
    title: inquiry.value.title,
    status: '접수중',
    date: new Date().toISOString().slice(0, 10).replace(/-/g, '.')
  })
  inquiry.value = { type: '', title: '', content: '' }
  store.showToast('문의가 접수되었습니다.')
}
</script>

<style scoped>
.board-page { padding: 48px 0 80px; }

.board-header { margin-bottom: 32px; }

.board-label {
  font-size: 11px;
  letter-spacing: 0.2em;
  color: #888;
  margin-bottom: 4px;
}

.board-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 40px;
  letter-spacing: 0.08em;
  color: #f2f0eb;
  margin: 0;
}

/* 탭 */
.board-tabs {
  display: flex;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  margin-bottom: 32px;
}

.tab-btn {
  padding: 12px 24px;
  font-size: 12px;
  letter-spacing: 0.1em;
  color: #888;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: -1px;
}

.tab-btn.active {
  color: #f2f0eb;
  border-bottom-color: #f2f0eb;
}

/* 게시글 */
.post-list {
  display: flex;
  flex-direction: column;
}

.post-item {
  border-bottom: 1px solid rgba(255,255,255,0.06);
  cursor: pointer;
}

.post-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 0;
}

.post-badge {
  font-size: 10px;
  padding: 2px 8px;
  background: #b8a898;
  color: #0d0d0d;
  white-space: nowrap;
  flex-shrink: 0;
}

.post-badge.done { background: #4a7c59; color: #fff; }

.post-title {
  flex: 1;
  font-size: 13px;
  color: #f2f0eb;
}

.post-date {
  font-size: 11px;
  color: #666;
  white-space: nowrap;
}

.post-item .bi-chevron-up,
.post-item .bi-chevron-down {
  font-size: 12px;
  color: #666;
}

.post-content {
  padding: 16px;
  background: #111;
  font-size: 13px;
  color: #888;
  line-height: 1.8;
  margin-bottom: 8px;
}

/* FAQ */
.faq-cats {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.faq-cat-btn {
  padding: 6px 16px;
  font-size: 12px;
  letter-spacing: 0.05em;
  background: transparent;
  color: #888;
  border: 1px solid rgba(255,255,255,0.1);
  cursor: pointer;
  transition: all 0.2s;
}

.faq-cat-btn.active,
.faq-cat-btn:hover {
  background: #f2f0eb;
  color: #0d0d0d;
  border-color: #f2f0eb;
}

.faq-q {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 16px;
  color: #b8a898;
  flex-shrink: 0;
}

.faq-a {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 16px;
  color: #b8a898;
  margin-right: 8px;
}

/* 로그인 필요 */
.login-required {
  text-align: center;
  padding: 60px 0;
  color: #888;
}

.login-required i {
  font-size: 40px;
  display: block;
  margin-bottom: 16px;
  color: #444;
}

.login-required p { margin-bottom: 20px; font-size: 14px; }

.login-required-btn {
  display: inline-block;
  padding: 12px 32px;
  background: #f2f0eb;
  color: #0d0d0d;
  font-size: 12px;
  letter-spacing: 0.1em;
  text-decoration: none;
}

/* 문의 폼 */
.inquiry-form {
  background: #111;
  border: 1px solid rgba(255,255,255,0.06);
  padding: 24px;
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group { display: flex; flex-direction: column; gap: 6px; }

.form-label-custom {
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #888;
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
  appearance: none;
}

.input-custom option { background: #0d0d0d; }

.textarea-custom {
  width: 100%;
  background: #0d0d0d;
  border: 1px solid rgba(255,255,255,0.12);
  color: #f2f0eb;
  padding: 10px 14px;
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  outline: none;
  resize: vertical;
}

.textarea-custom::placeholder { color: #555; }

.submit-btn {
  padding: 13px;
  background: #f2f0eb;
  color: #0d0d0d;
  border: none;
  font-size: 12px;
  letter-spacing: 0.12em;
  cursor: pointer;
  transition: opacity 0.2s;
  align-self: flex-end;
  width: 160px;
}

.submit-btn:hover { opacity: 0.85; }

/* 내 문의 내역 */
.my-inquiry-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 20px;
  letter-spacing: 0.08em;
  color: #f2f0eb;
  margin-bottom: 16px;
}
</style>