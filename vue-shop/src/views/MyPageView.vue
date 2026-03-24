<template>
  <div class="mypage">
    <div class="container">
      <div class="board-header">
        <p class="board-label">MY PAGE</p>
        <h1 class="board-title">마이페이지</h1>
      </div>

      <!-- 탭 -->
      <div class="my-tabs">
        <button class="my-tab" :class="{ active: tab === 'info' }" @click="tab = 'info'">
          회원정보
        </button>
        <button
          class="my-tab"
          :class="{ active: tab === 'orders' }"
          @click="
            tab = 'orders';
            loadOrders();
          "
        >
          주문내역
        </button>
        <button
          class="my-tab"
          :class="{ active: tab === 'reviews' }"
          @click="
            tab = 'reviews';
            loadMyReviews();
            loadOrders();
          "
        >
          내 리뷰
        </button>
      </div>

      <!-- ===== 회원정보 탭 ===== -->
      <div v-if="tab === 'info'">
        <div class="info-section">
          <h3 class="section-title">회원정보</h3>
          <div v-if="!editMode" class="info-box">
            <div class="info-row">
              <span class="info-label">이름</span>
              <span class="info-value">{{ member.name }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">아이디</span>
              <span class="info-value">{{ member.loginId }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">이메일</span>
              <span class="info-value">{{ member.email }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">전화번호</span>
              <span class="info-value">{{ member.phone || "-" }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">우편번호</span>
              <span class="info-value">{{ member.zipcode || "-" }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">기본주소</span>
              <span class="info-value">{{ member.address || "-" }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">상세주소</span>
              <span class="info-value">{{ member.addressDetail || "-" }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">가입일</span>
              <span class="info-value">{{ member.created?.slice(0, 10) }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">등급</span>
              <span class="info-value" :style="{ color: gradeColor(member.grade) }">
                {{ member.grade || "브론즈" }}
              </span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 24px">
              <button class="withdraw-btn" @click="withdrawMember">회원탈퇴</button>
              <button class="submit-btn" @click="startEdit">정보 수정</button>
            </div>
          </div>

          <!-- 수정 폼 -->
          <div v-else class="info-box">
            <div class="form-group">
              <label class="form-label-custom">이름</label>
              <input v-model="editForm.name" type="text" class="input-custom" />
            </div>
            <div class="form-group">
              <label class="form-label-custom">이메일</label>
              <input v-model="editForm.email" type="email" class="input-custom" />
            </div>
            <div class="form-group">
              <label class="form-label-custom">전화번호</label>
              <input
                v-model="editForm.phone"
                type="text"
                class="input-custom"
                placeholder="010-1234-5678"
              />
            </div>
            <div class="form-group">
              <label class="form-label-custom">우편번호</label>
              <input v-model="editForm.zipcode" type="text" class="input-custom" />
            </div>
            <div class="form-group">
              <label class="form-label-custom">기본주소</label>
              <input v-model="editForm.address" type="text" class="input-custom" />
            </div>
            <div class="form-group">
              <label class="form-label-custom">상세주소</label>
              <input v-model="editForm.address_detail" type="text" class="input-custom" />
            </div>
            <div class="form-group">
              <label class="form-label-custom">새 비밀번호 (변경시에만 입력)</label>
              <input
                v-model="editForm.loginPw"
                type="password"
                class="input-custom"
                placeholder="변경할 비밀번호 입력"
              />
            </div>
            <div
              style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 24px"
            >
              <button class="delete-btn" @click="editMode = false">취소</button>
              <button class="submit-btn" @click="submitEdit">수정 완료</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== 주문내역 탭 ===== -->
      <div v-if="tab === 'orders'">
        <h3 class="section-title">주문내역</h3>
        <div v-if="orders.length === 0" class="empty-orders">
          <i class="bi bi-bag"></i>
          <p>주문 내역이 없습니다.</p>
        </div>
        <div v-else class="order-list">
          <div v-for="order in orders" :key="order.id" class="order-item">
            <div class="order-header">
              <div>
                <span class="order-date">{{ order.created?.slice(0, 10) }}</span>
                <span class="order-id">주문번호 #{{ order.id }}</span>
              </div>
              <span class="order-amount">{{ order.amount?.toLocaleString() }}원</span>
            </div>
            <div class="order-body">
              <div class="order-row">
                <span class="order-label">배송지</span>
                <span class="order-value">{{ order.address }}</span>
              </div>
              <div class="order-row">
                <span class="order-label">결제수단</span>
                <span class="order-value">{{ order.payment }}</span>
              </div>
              <div class="order-row">
                <span class="order-label">상품</span>
                <span class="order-value">
                  <span
                    v-for="item in order.orderItems"
                    :key="item.id"
                    style="display: block"
                  >
                    {{ item.itemName || "상품ID: " + item.itemId }}
                    <span v-if="item.color" style="color: #888">/ {{ item.color }}</span>
                    <span v-if="item.size" style="color: #888">/ {{ item.size }}</span>
                    x {{ item.quantity }}개
                  </span>
                </span>
              </div>
              <div class="order-row">
                <span class="order-label">상태</span>
                <span
                  class="order-value"
                  :style="{ color: order.status === '취소' ? '#c0392b' : '#f2f0eb' }"
                >
                  {{ order.status }}
                </span>
              </div>
            </div>
            <!-- 주문취소 버튼 -->
            <div
              v-if="order.status === '주문접수' || order.status === '배송중'"
              style="display: flex; justify-content: flex-end; margin-top: 12px"
            >
              <button class="cancel-btn" @click="cancelOrder(order.id)">주문취소</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== 내 리뷰 탭 ===== -->
      <div v-if="tab === 'reviews'">
        <h3 class="section-title">내 리뷰</h3>
        <div v-if="myReviews.length === 0" class="empty-orders">
          <i class="bi bi-star"></i>
          <p>작성한 리뷰가 없습니다.</p>
        </div>
        <div v-else class="order-list">
          <div v-for="review in reviewsWithInfo" :key="review.id" class="order-item">
            <div class="order-header">
              <div>
                <span class="order-date">{{ review.created?.slice(0, 10) }}</span>
                <span class="order-id">
                  {{ review.itemName || "상품ID: " + review.itemId }}
                  <span v-if="review.color" style="color: #888; font-size: 11px"
                    >/ {{ review.color }}</span
                  >
                  <span v-if="review.size" style="color: #888; font-size: 11px"
                    >/ {{ review.size }}</span
                  >
                </span>
              </div>
              <div class="star-display">
                <span
                  v-for="n in 5"
                  :key="n"
                  :style="{ color: n <= review.rating ? '#FFD700' : '#444' }"
                  >★</span
                >
              </div>
            </div>
            <div class="order-body">
              <div class="order-row">
                <span class="order-label">내용</span>
                <span class="order-value">
                  <span v-if="editReviewId !== review.id">{{ review.content }}</span>
                  <div v-else>
                    <textarea
                      v-model="editReviewForm.content"
                      class="review-textarea"
                      rows="3"
                    ></textarea>
                    <div style="margin-top: 8px">
                      <span
                        v-for="n in 5"
                        :key="n"
                        @click="editReviewForm.rating = n"
                        :style="{
                          color: n <= editReviewForm.rating ? '#FFD700' : '#444',
                          cursor: 'pointer',
                          fontSize: '20px',
                        }"
                        >★</span
                      >
                    </div>
                  </div>
                </span>
              </div>
            </div>
            <div
              style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px"
            >
              <template v-if="editReviewId === review.id">
                <button class="cancel-btn" @click="editReviewId = null">취소</button>
                <button
                  class="submit-btn"
                  style="width: 80px; padding: 6px"
                  @click="submitEditReview(review.id)"
                >
                  저장
                </button>
              </template>
              <template v-else>
                <button class="cancel-btn" @click="startEditReview(review)">수정</button>
                <button class="delete-btn-review" @click="deleteReview(review.id)">
                  삭제
                </button>
              </template>
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
import { useRouter } from "vue-router";

const store = useShopStore();
const router = useRouter();
const tab = ref("info");
const member = ref({});
const editMode = ref(false);
const editForm = ref({});
const orders = ref([]);

// 내 리뷰
const myReviews = ref([]);
const editReviewId = ref(null);
const editReviewForm = ref({ content: "", rating: 5 });

onMounted(() => {
  if (!store.isLoggedIn) {
    router.push("/");
    return;
  }
  loadMember();
});

// 등급 색상
function gradeColor(grade) {
  switch (grade) {
    case "실버":
      return "#C0C0C0";
    case "골드":
      return "#FFD700";
    case "플래티넘":
      return "#b8a8e8";
    default:
      return "#cd7f32";
  }
}

async function loadMember() {
  if (!store.user?.loginId) return;
  try {
    const res = await fetch(`/api/member/info/${store.user.loginId}`);
    member.value = await res.json();
  } catch (e) {
    console.error(e);
  }
}

async function loadOrders() {
  if (!store.user?.loginId) return;
  try {
    const res = await fetch(`/api/order/${store.user.loginId}`);
    orders.value = await res.json();
  } catch (e) {
    console.error(e);
  }
}

// 주문 취소
async function cancelOrder(id) {
  if (!confirm("주문을 취소하시겠습니까?")) return;
  try {
    const res = await fetch(`/api/order/${id}/cancel`, { method: "PUT" });
    const data = await res.json();
    if (data.success) {
      store.showToast("주문이 취소되었습니다.");
      loadOrders();
    } else {
      store.showToast(data.message || "취소 실패", "error");
    }
  } catch (e) {
    store.showToast("오류가 발생했습니다.", "error");
  }
}

// 회원탈퇴
async function withdrawMember() {
  if (!confirm("정말 탈퇴하시겠습니까? 모든 정보가 삭제됩니다.")) return;
  try {
    const res = await fetch(`/api/member/delete/${store.user.loginId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.success) {
      store.logout();
      store.showToast("탈퇴되었습니다.");
      router.push("/");
    } else {
      store.showToast(data.message || "탈퇴 실패", "error");
    }
  } catch (e) {
    store.showToast("오류가 발생했습니다.", "error");
  }
}

// 내 리뷰 불러오기
async function loadMyReviews() {
  if (!store.user?.loginId) return;
  try {
    const res = await fetch(`/api/review/member/${store.user.loginId}`);
    myReviews.value = await res.json();
  } catch (e) {
    console.error(e);
  }
}

// 리뷰 수정 시작
function startEditReview(review) {
  editReviewId.value = review.id;
  editReviewForm.value = { content: review.content, rating: review.rating };
}

// 리뷰 수정 제출
async function submitEditReview(id) {
  try {
    const res = await fetch(`/api/review/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editReviewForm.value),
    });
    const data = await res.json();
    if (data.success) {
      store.showToast("수정되었습니다.");
      editReviewId.value = null;
      loadMyReviews();
    }
  } catch (e) {
    store.showToast("오류가 발생했습니다.", "error");
  }
}

// 리뷰 삭제
async function deleteReview(id) {
  if (!confirm("리뷰를 삭제하시겠습니까?")) return;
  try {
    const res = await fetch(`/api/review/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      store.showToast("삭제되었습니다.");
      loadMyReviews();
    }
  } catch (e) {
    store.showToast("오류가 발생했습니다.", "error");
  }
}

// 리뷰에 주문 정보 연결 (상품명/컬러/사이즈 표시용)
const reviewsWithInfo = computed(() => {
  return myReviews.value.map((review) => {
    // 모든 주문에서 해당 상품 찾기
    const orderItem = orders.value
      .flatMap((o) => o.orderItems || [])
      .find((i) => i.itemId === review.itemId);
    return {
      ...review,
      itemName: orderItem?.itemName || null,
      color: orderItem?.color || null,
      size: orderItem?.size || null,
    };
  });
});

function startEdit() {
  editForm.value = {
    name: member.value.name,
    email: member.value.email,
    phone: member.value.phone,
    zipcode: member.value.zipcode,
    address: member.value.address,
    address_detail: member.value.addressDetail,
    loginPw: "",
  };
  editMode.value = true;
}

async function submitEdit() {
  try {
    const res = await fetch(`/api/member/update/${store.user.loginId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm.value),
    });
    const data = await res.json();
    if (data.success) {
      store.showToast("수정되었습니다.");
      editMode.value = false;
      loadMember();
    } else {
      store.showToast(data.message || "수정 실패", "error");
    }
  } catch (e) {
    store.showToast("오류가 발생했습니다.", "error");
  }
}
</script>

<style scoped>
.mypage {
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
.my-tabs {
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 32px;
}
.my-tab {
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
.my-tab.active {
  color: #f2f0eb;
  border-bottom-color: #f2f0eb;
}
.section-title {
  font-family: "Bebas Neue", sans-serif;
  font-size: 20px;
  letter-spacing: 0.08em;
  color: #f2f0eb;
  margin-bottom: 16px;
}
.info-box {
  background: #111;
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 24px;
}
.info-row {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.info-label {
  width: 120px;
  font-size: 11px;
  letter-spacing: 0.1em;
  color: #888;
  text-transform: uppercase;
}
.info-value {
  font-size: 13px;
  color: #f2f0eb;
}
.form-group {
  margin-bottom: 16px;
}
.form-label-custom {
  display: block;
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 6px;
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
.submit-btn {
  padding: 13px;
  background: #f2f0eb;
  color: #0d0d0d;
  border: none;
  font-size: 12px;
  letter-spacing: 0.12em;
  cursor: pointer;
  transition: opacity 0.2s;
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
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.2s;
}
.delete-btn:hover {
  background: #333;
  color: #fff;
}
.empty-orders {
  text-align: center;
  padding: 60px 0;
  color: #888;
}
.empty-orders i {
  font-size: 40px;
  display: block;
  margin-bottom: 16px;
  color: #444;
}
.empty-orders p {
  font-size: 14px;
}
.order-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.order-item {
  background: #111;
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 20px;
}
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.order-date {
  font-size: 11px;
  color: #888;
  margin-right: 12px;
}
.order-id {
  font-size: 12px;
  color: #f2f0eb;
}
.order-amount {
  font-size: 16px;
  color: #f2f0eb;
}
.order-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.order-row {
  display: flex;
  gap: 16px;
  font-size: 13px;
}
.order-label {
  width: 80px;
  color: #888;
  flex-shrink: 0;
}
.order-value {
  color: #f2f0eb;
}
.cancel-btn {
  background: none;
  border: 1px solid #c0392b;
  color: #c0392b;
  font-size: 11px;
  padding: 6px 16px;
  cursor: pointer;
  transition: all 0.2s;
}
.cancel-btn:hover {
  background: #c0392b;
  color: #fff;
}
.withdraw-btn {
  background: none;
  border: 1px solid #c0392b;
  color: #c0392b;
  font-size: 11px;
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.2s;
}
.withdraw-btn:hover {
  background: #c0392b;
  color: #fff;
}
.review-textarea {
  width: 100%;
  background: #0d0d0d;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #f2f0eb;
  padding: 10px 14px;
  font-size: 13px;
  outline: none;
  resize: vertical;
}
.star-display {
  display: flex;
  gap: 2px;
  font-size: 16px;
}
.delete-btn-review {
  background: none;
  border: 1px solid #c0392b;
  color: #c0392b;
  font-size: 11px;
  padding: 6px 16px;
  cursor: pointer;
  transition: all 0.2s;
}
.delete-btn-review:hover {
  background: #c0392b;
  color: #fff;
}
</style>
