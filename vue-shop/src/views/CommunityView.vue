<template>
  <div class="community-page">
    <div class="container">
      <div class="board-header">
        <p class="board-label">COMMUNITY</p>
        <h1 class="board-title">커뮤니티</h1>
      </div>

      <!-- 게시글 등록 버튼 -->
      <div v-if="store.isLoggedIn" style="margin-bottom: 16px">
        <button class="submit-btn" @click="showForm = !showForm">글 작성</button>
      </div>

      <!-- 등록/수정 폼 -->
      <div
        v-if="store.isLoggedIn && showForm"
        class="inquiry-form"
        style="margin-bottom: 24px"
      >
        <div class="form-group">
          <label class="form-label-custom">제목</label>
          <input
            v-model="boardForm.title"
            type="text"
            class="input-custom"
            placeholder="제목 입력"
          />
        </div>
        <div class="form-group">
          <label class="form-label-custom">내용</label>
          <textarea
            v-model="boardForm.content"
            class="textarea-custom"
            rows="5"
            placeholder="내용 입력"
          ></textarea>
        </div>
        <div style="display: flex; gap: 8px; justify-content: flex-end">
          <button class="delete-btn" @click="cancelForm">취소</button>
          <button class="submit-btn" @click="submitBoard">
            {{ editId ? "수정 완료" : "등록" }}
          </button>
        </div>
      </div>

      <!-- 검색바 -->
      <div style="margin-bottom: 16px">
        <input
          v-model="searchKeyword"
          type="text"
          class="input-custom"
          placeholder="제목, 내용, 작성자 검색"
        />
      </div>

      <!-- 게시글 목록 -->
      <div class="post-list">
        <div v-for="item in filteredBoards" :key="item.id" class="post-item">
          <div class="post-row" @click="toggleBoard(item.id)">
            <span class="post-title">{{ item.title }}</span>
            <span class="post-date">{{ item.name }}</span>
            <span class="post-date">{{ item.created?.slice(0, 10) }}</span>
            <template
              v-if="
                store.isLoggedIn && (store.user.loginId === item.loginId || store.isAdmin)
              "
            >
              <button class="delete-btn" @click.stop="startEdit(item)">수정</button>
              <button class="delete-btn" @click.stop="deleteBoard(item.id)">삭제</button>
            </template>
            <i
              class="bi"
              :class="openId === item.id ? 'bi-chevron-up' : 'bi-chevron-down'"
            ></i>
          </div>

          <!-- 게시글 내용 + 댓글 -->
          <div v-if="openId === item.id" class="post-content">
            <p style="margin-bottom: 16px">{{ item.content }}</p>

            <!-- 댓글 목록 -->
            <div class="comment-section">
              <h4 class="comment-title">댓글</h4>
              <div
                v-for="comment in comments[item.id]"
                :key="comment.id"
                class="comment-item"
              >
                <div class="comment-row">
                  <span class="comment-name">{{ comment.name }}</span>
                  <span class="comment-date">{{ comment.created?.slice(0, 10) }}</span>
                  <button
                    v-if="
                      store.isLoggedIn &&
                      (store.user.loginId === comment.loginId || store.isAdmin)
                    "
                    class="delete-btn"
                    @click="deleteComment(comment.id, item.id)"
                  >
                    삭제
                  </button>
                </div>
                <p class="comment-content">{{ comment.content }}</p>
              </div>

              <!-- 댓글 입력 -->
              <div v-if="store.isLoggedIn" class="comment-form">
                <input
                  v-model="commentText[item.id]"
                  type="text"
                  class="input-custom"
                  placeholder="댓글 입력"
                />
                <button
                  class="submit-btn"
                  style="width: 100px"
                  @click="submitComment(item.id)"
                >
                  등록
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 로그인 안내 -->
      <div v-if="!store.isLoggedIn" class="login-required">
        <i class="bi bi-lock"></i>
        <p>로그인 후 글을 작성할 수 있습니다.</p>
        <button class="login-required-btn" @click="store.showLoginModal = true">
          로그인하기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useShopStore } from "@/store/shop";

const store = useShopStore();
const boards = ref([]);
const openId = ref(null);
const showForm = ref(false);
const editId = ref(null);
const boardForm = ref({ title: "", content: "" });
const comments = ref({});
const commentText = ref({});
const searchKeyword = ref(""); // 검색어

// 검색 필터된 게시글
const filteredBoards = computed(() => {
  if (!searchKeyword.value) return boards.value;
  const q = searchKeyword.value.toLowerCase();
  return boards.value.filter(
    (b) =>
      b.title?.toLowerCase().includes(q) ||
      b.content?.toLowerCase().includes(q) ||
      b.name?.toLowerCase().includes(q)
  );
});

onMounted(() => loadBoards());

async function loadBoards() {
  try {
    const res = await fetch("/api/community");
    boards.value = await res.json();
  } catch (e) {
    console.error(e);
  }
}

async function toggleBoard(id) {
  openId.value = openId.value === id ? null : id;
  if (openId.value && !comments.value[id]) {
    loadComments(id);
  }
}

async function loadComments(boardId) {
  try {
    const res = await fetch(`/api/community/${boardId}/comments`);
    comments.value[boardId] = await res.json();
  } catch (e) {
    console.error(e);
  }
}

function startEdit(item) {
  editId.value = item.id;
  boardForm.value = { title: item.title, content: item.content };
  showForm.value = true;
}

function cancelForm() {
  showForm.value = false;
  editId.value = null;
  boardForm.value = { title: "", content: "" };
}

async function submitBoard() {
  if (!boardForm.value.title || !boardForm.value.content) {
    store.showToast("제목과 내용을 입력해주세요.", "error");
    return;
  }
  try {
    const url = editId.value ? `/api/community/${editId.value}` : "/api/community";
    const method = editId.value ? "PUT" : "POST";
    const body = editId.value
      ? { title: boardForm.value.title, content: boardForm.value.content }
      : {
          title: boardForm.value.title,
          content: boardForm.value.content,
          loginId: store.user.loginId,
          name: store.user.name,
        };
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.success) {
      store.showToast(editId.value ? "수정되었습니다." : "등록되었습니다.");
      cancelForm();
      loadBoards();
    }
  } catch (e) {
    store.showToast("오류가 발생했습니다.", "error");
  }
}

async function deleteBoard(id) {
  if (!confirm("삭제하시겠습니까?")) return;
  try {
    await fetch(`/api/community/${id}`, { method: "DELETE" });
    store.showToast("삭제되었습니다.");
    loadBoards();
  } catch (e) {
    store.showToast("오류가 발생했습니다.", "error");
  }
}

async function submitComment(boardId) {
  if (!commentText.value[boardId]) return;
  try {
    const res = await fetch(`/api/community/${boardId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: commentText.value[boardId],
        loginId: store.user.loginId,
        name: store.user.name,
      }),
    });
    const data = await res.json();
    if (data.success) {
      commentText.value[boardId] = "";
      loadComments(boardId);
    }
  } catch (e) {
    store.showToast("오류가 발생했습니다.", "error");
  }
}

async function deleteComment(commentId, boardId) {
  if (!confirm("삭제하시겠습니까?")) return;
  try {
    await fetch(`/api/community/comments/${commentId}`, { method: "DELETE" });
    store.showToast("삭제되었습니다.");
    loadComments(boardId);
  } catch (e) {
    store.showToast("오류가 발생했습니다.", "error");
  }
}
</script>

<style scoped>
.community-page {
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
.post-content {
  padding: 16px;
  background: #111;
  font-size: 13px;
  color: #888;
  line-height: 1.8;
  margin-bottom: 8px;
}
.comment-section {
  margin-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 16px;
}
.comment-title {
  font-size: 12px;
  letter-spacing: 0.1em;
  color: #888;
  margin-bottom: 12px;
}
.comment-item {
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}
.comment-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}
.comment-name {
  font-size: 12px;
  color: #b8a898;
}
.comment-date {
  font-size: 11px;
  color: #555;
  flex: 1;
}
.comment-content {
  font-size: 13px;
  color: #888;
}
.comment-form {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
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
  outline: none;
}
.textarea-custom {
  width: 100%;
  background: #0d0d0d;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #f2f0eb;
  padding: 10px 14px;
  font-size: 13px;
  outline: none;
  resize: vertical;
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
  cursor: pointer;
  border: none;
}
</style>
