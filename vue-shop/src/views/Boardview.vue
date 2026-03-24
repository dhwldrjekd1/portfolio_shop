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
        <!-- 관리자 등록 버튼 -->
        <div v-if="store.isAdmin" style="margin-bottom: 16px">
          <button class="submit-btn" @click="showNoticeForm = !showNoticeForm">
            공지사항 등록
          </button>
        </div>

        <!-- 관리자 등록 폼 -->
        <div
          v-if="store.isAdmin && showNoticeForm"
          class="inquiry-form"
          style="margin-bottom: 24px"
        >
          <div class="form-group">
            <label class="form-label-custom">제목</label>
            <input
              v-model="noticeForm.title"
              type="text"
              class="input-custom"
              placeholder="제목 입력"
            />
          </div>
          <div class="form-group">
            <label class="form-label-custom">내용</label>
            <textarea
              v-model="noticeForm.content"
              class="textarea-custom"
              rows="4"
              placeholder="내용 입력"
            ></textarea>
          </div>
          <label
            style="
              color: #888;
              font-size: 12px;
              display: flex;
              align-items: center;
              gap: 8px;
            "
          >
            <input type="checkbox" v-model="noticeForm.important" /> 중요 공지
          </label>
          <button class="submit-btn" @click="submitNotice">등록</button>
        </div>

        <!-- 수정 폼 -->
        <div
          v-if="store.isAdmin && editNotice"
          class="inquiry-form"
          style="margin-bottom: 24px"
        >
          <div class="form-group">
            <label class="form-label-custom">제목</label>
            <input v-model="editNotice.title" type="text" class="input-custom" />
          </div>
          <div class="form-group">
            <label class="form-label-custom">내용</label>
            <textarea
              v-model="editNotice.content"
              class="textarea-custom"
              rows="4"
            ></textarea>
          </div>
          <label
            style="
              color: #888;
              font-size: 12px;
              display: flex;
              align-items: center;
              gap: 8px;
            "
          >
            <input type="checkbox" v-model="editNotice.important" /> 중요 공지
          </label>
          <div style="display: flex; gap: 8px; justify-content: flex-end">
            <button class="delete-btn" @click="editNotice = null">취소</button>
            <button class="submit-btn" @click="submitEditNotice">수정 완료</button>
          </div>
        </div>

        <div class="post-list">
          <div v-for="post in notices" :key="post.id" class="post-item">
            <div class="post-row" @click="togglePost(post)">
              <span v-if="post.important" class="post-badge">중요</span>
              <span class="post-title">{{ post.title }}</span>
              <span class="post-date">{{ post.created?.slice(0, 10) }}</span>
              <template v-if="store.isAdmin">
                <button class="delete-btn" @click.stop="startEditNotice(post)">
                  수정
                </button>
                <button class="delete-btn" @click.stop="deleteNotice(post.id)">
                  삭제
                </button>
              </template>
              <i class="bi" :class="post.open ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
            </div>
            <div v-if="post.open" class="post-content">
              {{ post.content }}
            </div>
          </div>
        </div>
      </div>

      <!-- ===== QnA ===== -->
      <div v-if="currentTab === 'faq'">
        <!-- 관리자 등록 버튼 -->
        <div v-if="store.isAdmin" style="margin-bottom: 16px">
          <button class="submit-btn" @click="showQnaForm = !showQnaForm">QnA 등록</button>
        </div>

        <!-- 등록/수정 폼 -->
        <div
          v-if="store.isAdmin && showQnaForm"
          class="inquiry-form"
          style="margin-bottom: 24px"
        >
          <div class="form-group">
            <label class="form-label-custom">카테고리</label>
            <select v-model="qnaForm.category" class="input-custom">
              <option value="">선택해주세요</option>
              <option>주문/결제</option>
              <option>배송</option>
              <option>교환/반품</option>
              <option>상품</option>
              <option>기타</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label-custom">질문</label>
            <input
              v-model="qnaForm.title"
              type="text"
              class="input-custom"
              placeholder="질문 입력"
            />
          </div>
          <div class="form-group">
            <label class="form-label-custom">답변</label>
            <textarea
              v-model="qnaForm.content"
              class="textarea-custom"
              rows="4"
              placeholder="답변 입력"
            ></textarea>
          </div>
          <div style="display: flex; gap: 8px; justify-content: flex-end">
            <button class="delete-btn" @click="cancelQnaForm">취소</button>
            <button class="submit-btn" @click="submitQna">
              {{ editQnaId ? "수정 완료" : "등록" }}
            </button>
          </div>
        </div>

        <!-- 카테고리 필터 -->
        <div class="faq-cats">
          <button
            v-for="cat in faqCategories"
            :key="cat"
            class="faq-cat-btn"
            :class="{ active: currentFaqCat === cat }"
            @click="filterQna(cat)"
          >
            {{ cat }}
          </button>
        </div>

        <!-- QnA 목록 -->
        <div class="post-list">
          <div v-for="item in qnas" :key="item.id" class="post-item">
            <div class="post-row" @click="toggleQna(item.id)">
              <span class="faq-q">Q</span>
              <span class="post-title">{{ item.title }}</span>
              <span class="post-date">{{ item.category }}</span>
              <template v-if="store.isAdmin">
                <button class="delete-btn" @click.stop="startEditQna(item)">수정</button>
                <button class="delete-btn" @click.stop="deleteQna(item.id)">삭제</button>
              </template>
              <i
                class="bi"
                :class="openQna === item.id ? 'bi-chevron-up' : 'bi-chevron-down'"
              ></i>
            </div>
            <div v-if="openQna === item.id" class="post-content">
              <span class="faq-a">A</span> {{ item.content }}
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
          <button class="login-required-btn" @click="store.showLoginModal = true">
            로그인하기
          </button>
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
              <input
                v-model="inquiry.title"
                type="text"
                class="input-custom"
                placeholder="문의 제목 입력"
              />
            </div>
            <div class="form-group">
              <label class="form-label-custom">내용</label>
              <textarea
                v-model="inquiry.content"
                class="textarea-custom"
                placeholder="문의 내용을 입력해주세요."
                rows="5"
              ></textarea>
            </div>
            <button class="submit-btn" @click="submitInquiry">문의 접수</button>
          </div>
        </div>
        <!-- 내 문의 내역 -->
        <div v-if="myInquiries.length > 0" class="my-inquiries">
          <h3 class="my-inquiry-title">내 문의 내역</h3>
          <div class="post-list">
            <div v-for="item in myInquiries" :key="item.id" class="post-item">
              <div class="post-row" @click="toggleInquiry(item)">
                <span
                  class="post-badge"
                  :class="item.status === '답변완료' ? 'done' : ''"
                >
                  {{ item.status }}
                </span>
                <span class="post-title">{{ item.title }}</span>
                <span class="post-date">{{ item.created?.slice(0, 10) }}</span>
                <button class="delete-btn" @click.stop="startEditInquiry(item)">
                  수정
                </button>
                <button class="delete-btn" @click.stop="deleteInquiry(item.id)">
                  삭제
                </button>
                <i
                  class="bi"
                  :class="openInquiry === item.id ? 'bi-chevron-up' : 'bi-chevron-down'"
                ></i>
              </div>
              <div v-if="openInquiry === item.id" class="post-content">
                <div v-if="editInquiry && editInquiry.id === item.id">
                  <textarea
                    v-model="editInquiry.content"
                    class="textarea-custom"
                    rows="3"
                  ></textarea>
                  <div
                    style="
                      display: flex;
                      gap: 8px;
                      justify-content: flex-end;
                      margin-top: 8px;
                    "
                  >
                    <button class="delete-btn" @click="editInquiry = null">취소</button>
                    <button class="submit-btn" @click="submitEditInquiry(item.id)">
                      수정 완료
                    </button>
                  </div>
                </div>
                <div v-else>
                  <p>{{ item.content }}</p>
                  <div v-if="item.reply" class="reply-box">
                    <span class="reply-label">답변</span>
                    <p>{{ item.reply }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 관리자 전체 문의 -->
        <div v-if="store.isAdmin" class="my-inquiries">
          <h3 class="my-inquiry-title">전체 문의 내역 (관리자)</h3>
          <div class="post-list">
            <div v-for="item in allInquiries" :key="item.id" class="post-item">
              <div class="post-row" @click="toggleInquiry(item)">
                <span
                  class="post-badge"
                  :class="item.status === '답변완료' ? 'done' : ''"
                >
                  {{ item.status }}
                </span>
                <span class="post-title">{{ item.title }}</span>
                <span class="post-date">{{ item.name }}</span>
                <button class="delete-btn" @click.stop="deleteInquiry(item.id)">
                  삭제
                </button>
                <i
                  class="bi"
                  :class="openInquiry === item.id ? 'bi-chevron-up' : 'bi-chevron-down'"
                ></i>
              </div>
              <div v-if="openInquiry === item.id" class="post-content">
                <p>{{ item.content }}</p>
                <div v-if="item.reply" class="reply-box">
                  <span class="reply-label">답변</span>
                  <p>{{ item.reply }}</p>
                </div>
                <div v-if="!item.reply" class="reply-form">
                  <textarea
                    v-model="replyText[item.id]"
                    class="textarea-custom"
                    placeholder="답글 입력"
                    rows="3"
                  ></textarea>
                  <button class="submit-btn" @click="submitReply(item.id)">
                    답글 등록
                  </button>
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
import { ref, computed, onMounted } from "vue";
import { useShopStore } from "@/store/shop";

const store = useShopStore();

const tabs = [
  { id: "notice", name: "공지사항" },
  { id: "faq", name: "QnA" },
  { id: "inquiry", name: "고객문의" },
];

const currentTab = ref("notice");

// 공지사항
const notices = ref([]);

async function loadNotices() {
  try {
    const res = await fetch("/api/notice");
    notices.value = await res.json();
  } catch (e) {
    console.error(e);
  }
}

// 공지사항 등록 (관리자)
const noticeForm = ref({ title: "", content: "", important: false });
const showNoticeForm = ref(false);

async function submitNotice() {
  if (!noticeForm.value.title || !noticeForm.value.content) {
    store.showToast("제목과 내용을 입력해주세요.", "error");
    return;
  }
  try {
    const res = await fetch("/api/notice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(noticeForm.value),
    });
    const data = await res.json();
    if (data.success) {
      store.showToast("공지사항이 등록되었습니다.");
      noticeForm.value = { title: "", content: "", important: false };
      showNoticeForm.value = false;
      loadNotices();
    }
  } catch (e) {
    store.showToast("오류가 발생했습니다.", "error");
  }
}

// 공지사항 수정
const editNotice = ref(null);

function startEditNotice(item) {
  editNotice.value = { ...item };
}

async function submitEditNotice() {
  try {
    const res = await fetch(`/api/notice/${editNotice.value.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editNotice.value),
    });
    const data = await res.json();
    if (data.success) {
      store.showToast("수정되었습니다.");
      editNotice.value = null;
      loadNotices();
    }
  } catch (e) {
    store.showToast("오류가 발생했습니다.", "error");
  }
}

async function deleteNotice(id) {
  if (!confirm("삭제하시겠습니까?")) return;
  try {
    await fetch(`/api/notice/${id}`, { method: "DELETE" });
    store.showToast("삭제되었습니다.");
    loadNotices();
  } catch (e) {
    store.showToast("오류가 발생했습니다.", "error");
  }
}

// QnA
const faqCategories = ["전체", "주문/결제", "배송", "교환/반품", "상품", "기타"];
const currentFaqCat = ref("전체");
const qnas = ref([]);
const openQna = ref(null);
const showQnaForm = ref(false);
const editQnaId = ref(null);
const qnaForm = ref({ category: "", title: "", content: "" });

async function loadQnas() {
  try {
    const res = await fetch("/api/qna");
    qnas.value = await res.json();
  } catch (e) {
    console.error(e);
  }
}

async function filterQna(cat) {
  currentFaqCat.value = cat;
  if (cat === "전체") {
    loadQnas();
  } else {
    const res = await fetch(`/api/qna/category/${cat}`);
    qnas.value = await res.json();
  }
}

function toggleQna(id) {
  openQna.value = openQna.value === id ? null : id;
}

function startEditQna(item) {
  editQnaId.value = item.id;
  qnaForm.value = { category: item.category, title: item.title, content: item.content };
  showQnaForm.value = true;
}

function cancelQnaForm() {
  showQnaForm.value = false;
  editQnaId.value = null;
  qnaForm.value = { category: "", title: "", content: "" };
}

async function submitQna() {
  if (!qnaForm.value.category || !qnaForm.value.title || !qnaForm.value.content) {
    store.showToast("모든 항목을 입력해주세요.", "error");
    return;
  }
  try {
    const url = editQnaId.value ? `/api/qna/${editQnaId.value}` : "/api/qna";
    const method = editQnaId.value ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(qnaForm.value),
    });
    const data = await res.json();
    if (data.success) {
      store.showToast(editQnaId.value ? "수정되었습니다." : "등록되었습니다.");
      cancelQnaForm();
      loadQnas();
    }
  } catch (e) {
    store.showToast("오류가 발생했습니다.", "error");
  }
}

async function deleteQna(id) {
  if (!confirm("삭제하시겠습니까?")) return;
  try {
    await fetch(`/api/qna/${id}`, { method: "DELETE" });
    store.showToast("삭제되었습니다.");
    loadQnas();
  } catch (e) {
    store.showToast("오류가 발생했습니다.", "error");
  }
}

// 고객문의 수정
const editInquiry = ref(null);

function startEditInquiry(item) {
  editInquiry.value = { ...item };
}

async function submitEditInquiry(id) {
  try {
    const res = await fetch(`/api/inquiry/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editInquiry.value.content }),
    });
    const data = await res.json();
    if (data.success) {
      store.showToast("수정되었습니다.");
      editInquiry.value = null;
      loadMyInquiries();
    }
  } catch (e) {
    store.showToast("오류가 발생했습니다.", "error");
  }
}

// 고객문의
const inquiry = ref({ type: "", title: "", content: "" });
const myInquiries = ref([]);
const replyText = ref({});
const openInquiry = ref(null);

// 내 문의 목록 불러오기
async function loadMyInquiries() {
  if (!store.user) return;
  try {
    const res = await fetch(`/api/inquiry/my/${store.user.loginId}`);
    myInquiries.value = await res.json();
  } catch (e) {
    console.error(e);
  }
}

// 전체 문의 목록 (관리자)
const allInquiries = ref([]);
async function loadAllInquiries() {
  try {
    const res = await fetch("/api/inquiry/all");
    allInquiries.value = await res.json();
  } catch (e) {
    console.error(e);
  }
}

onMounted(() => {
  loadNotices();
  loadQnas();
  if (store.isLoggedIn) loadMyInquiries();
  if (store.isAdmin) loadAllInquiries();
});

function togglePost(post) {
  post.open = !post.open;
}

function toggleInquiry(item) {
  openInquiry.value = openInquiry.value === item.id ? null : item.id;
}

async function submitInquiry() {
  if (!inquiry.value.type || !inquiry.value.title || !inquiry.value.content) {
    store.showToast("모든 항목을 입력해주세요.", "error");
    return;
  }
  try {
    const res = await fetch("/api/inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: inquiry.value.type,
        title: inquiry.value.title,
        content: inquiry.value.content,
        loginId: store.user.loginId,
        name: store.user.name,
      }),
    });
    const data = await res.json();
    if (data.success) {
      store.showToast("문의가 접수되었습니다.");
      inquiry.value = { type: "", title: "", content: "" };
      loadMyInquiries();
    }
  } catch (e) {
    store.showToast("오류가 발생했습니다.", "error");
  }
}

async function deleteInquiry(id) {
  if (!confirm("삭제하시겠습니까?")) return;
  try {
    await fetch(`/api/inquiry/${id}`, { method: "DELETE" });
    store.showToast("삭제되었습니다.");
    loadMyInquiries();
    if (store.isAdmin) loadAllInquiries();
  } catch (e) {
    store.showToast("오류가 발생했습니다.", "error");
  }
}

async function submitReply(id) {
  if (!replyText.value[id]) return;
  try {
    await fetch(`/api/inquiry/${id}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: replyText.value[id] }),
    });
    store.showToast("답글이 등록되었습니다.");
    replyText.value[id] = "";
    loadAllInquiries();
    loadMyInquiries();
  } catch (e) {
    store.showToast("오류가 발생했습니다.", "error");
  }
}
</script>

<style scoped>
.board-page {
  padding: 48px 0 80px;
}

.board-header {
  margin-bottom: 32px;
}

.board-label {
  font-size: 11px;
  letter-spacing: 0.2em;
  color: #888;
  margin-bottom: 4px;
}

.board-title {
  font-family: "Bebas Neue", sans-serif;
  font-size: 40px;
  letter-spacing: 0.08em;
  color: #f2f0eb;
  margin: 0;
}

/* 탭 */
.board-tabs {
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
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

.post-badge.done {
  background: #4a7c59;
  color: #fff;
}

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
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  font-family: "Bebas Neue", sans-serif;
  font-size: 16px;
  color: #b8a898;
  flex-shrink: 0;
}

.faq-a {
  font-family: "Bebas Neue", sans-serif;
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

.login-required p {
  margin-bottom: 20px;
  font-size: 14px;
}

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
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 24px;
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label-custom {
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #888;
}

.input-custom {
  width: 100%;
  background: #0d0d0d;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #f2f0eb;
  padding: 10px 14px;
  font-size: 13px;
  font-family: "DM Sans", sans-serif;
  outline: none;
  appearance: none;
}

.input-custom option {
  background: #0d0d0d;
}

.textarea-custom {
  width: 100%;
  background: #0d0d0d;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #f2f0eb;
  padding: 10px 14px;
  font-size: 13px;
  font-family: "DM Sans", sans-serif;
  outline: none;
  resize: vertical;
}

.textarea-custom::placeholder {
  color: #555;
}

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

.submit-btn:hover {
  opacity: 0.85;
}

/* 내 문의 내역 */
.my-inquiry-title {
  font-family: "Bebas Neue", sans-serif;
  font-size: 20px;
  letter-spacing: 0.08em;
  color: #f2f0eb;
  margin-bottom: 16px;
}
.delete-btn {
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #888;
  font-size: 11px;
  padding: 2px 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.delete-btn:hover {
  background: #ff4444;
  color: #fff;
  border-color: #ff4444;
}

.reply-box {
  margin-top: 12px;
  padding: 12px;
  background: #0d0d0d;
  border-left: 2px solid #b8a898;
}

.reply-label {
  font-size: 11px;
  color: #b8a898;
  letter-spacing: 0.1em;
  display: block;
  margin-bottom: 6px;
}

.reply-form {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
