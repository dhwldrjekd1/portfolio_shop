<template>
  <div class="admin-page">
    <div class="container">
      <div class="board-header">
        <p class="board-label">ADMIN</p>
        <h1 class="board-title">관리자 페이지</h1>
      </div>
      <div class="board-tabs">
        <button
          class="tab-btn"
          :class="{ active: currentTab === 'members' }"
          @click="currentTab = 'members'"
        >
          회원 목록
        </button>
        <button
          class="tab-btn"
          :class="{ active: currentTab === 'orders' }"
          @click="
            currentTab = 'orders';
            loadOrders();
          "
        >
          주문 관리
        </button>
        <button
          class="tab-btn"
          :class="{ active: currentTab === 'stock' }"
          @click="
            currentTab = 'stock';
            loadItems();
          "
        >
          재고 관리
        </button>
        <button
          class="tab-btn"
          :class="{ active: currentTab === 'sales' }"
          @click="
            currentTab = 'sales';
            loadSales();
          "
        >
          판매 관리
        </button>
        <button
          class="tab-btn"
          :class="{ active: currentTab === 'items' }"
          @click="
            currentTab = 'items';
            loadAdminItems();
          "
        >
          상품 관리
        </button>
        <button
          class="tab-btn"
          :class="{ active: currentTab === 'reviews' }"
          @click="
            currentTab = 'reviews';
            loadAllReviews();
          "
        >
          리뷰 관리
        </button>
      </div>

      <!-- ===== 회원 목록 ===== -->
      <div v-if="currentTab === 'members'">
        <input
          v-model="memberSearch"
          type="text"
          class="search-input"
          placeholder="이름, 아이디, 이메일 검색"
        />
        <table class="member-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>이름</th>
              <th>아이디</th>
              <th>이메일</th>
              <th>전화번호</th>
              <th>우편번호</th>
              <th>기본주소</th>
              <th>상세주소</th>
              <th>가입일</th>
              <th>권한</th>
              <th>등급</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in filteredMembers" :key="member.id">
              <td>{{ member.id }}</td>
              <td>{{ member.name }}</td>
              <td>{{ member.loginId }}</td>
              <td>{{ member.email }}</td>
              <td>{{ member.phone }}</td>
              <td>{{ member.zipcode }}</td>
              <td>{{ member.address }}</td>
              <td>{{ member.addressDetail }}</td>
              <td>{{ member.created?.slice(0, 10) }}</td>
              <td>{{ member.role }}</td>
              <td>
                <span :style="{ color: gradeColor(member.grade) }">{{
                  member.grade || "브론즈"
                }}</span>
              </td>
              <td>
                <select
                  class="status-select"
                  :value="member.grade || '브론즈'"
                  @change="updateGrade(member.loginId, $event.target.value)"
                  style="margin-bottom: 4px; display: block"
                >
                  <option>브론즈</option>
                  <option>실버</option>
                  <option>골드</option>
                  <option>플래티넘</option>
                </select>
                <select
                  class="status-select"
                  :value="member.role"
                  @change="updateRole(member.loginId, $event.target.value)"
                  style="margin-bottom: 4px; display: block"
                >
                  <option value="user">일반회원</option>
                  <option value="admin">관리자</option>
                  <option value="banned">강퇴</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- ===== 리뷰 관리 ===== -->
      <div v-if="currentTab === 'reviews'">
        <input
          v-model="reviewSearch"
          type="text"
          class="search-input"
          placeholder="이름, 회원ID, 내용 검색"
        />
        <table class="member-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>상품ID</th>
              <th>회원ID</th>
              <th>이름</th>
              <th>별점</th>
              <th>내용</th>
              <th>작성일</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="review in filteredReviews" :key="review.id">
              <td>{{ review.id }}</td>
              <td>{{ review.itemId }}</td>
              <td>{{ review.loginId }}</td>
              <td>{{ review.name }}</td>
              <td>
                <span style="color: #ffd700">
                  {{ "★".repeat(review.rating) }}{{ "☆".repeat(5 - review.rating) }}
                </span>
              </td>
              <td>
                <span v-if="editReviewId !== review.id">{{ review.content }}</span>
                <div v-else>
                  <textarea
                    v-model="editReviewForm.content"
                    class="search-input"
                    style="margin-bottom: 4px; height: 60px; resize: vertical"
                  ></textarea>
                  <div>
                    <span
                      v-for="n in 5"
                      :key="n"
                      @click="editReviewForm.rating = n"
                      :style="{
                        color: n <= editReviewForm.rating ? '#FFD700' : '#444',
                        cursor: 'pointer',
                        fontSize: '18px',
                      }"
                      >★</span
                    >
                  </div>
                </div>
              </td>
              <td>{{ review.created?.slice(0, 10) }}</td>
              <td>
                <template v-if="editReviewId === review.id">
                  <button
                    class="save-btn"
                    style="display: block; margin-bottom: 4px"
                    @click="submitAdminReview(review.id)"
                  >
                    저장
                  </button>
                  <button class="delete-btn" @click="editReviewId = null">취소</button>
                </template>
                <template v-else>
                  <button
                    class="save-btn"
                    style="display: block; margin-bottom: 4px"
                    @click="startAdminReview(review)"
                  >
                    수정
                  </button>
                  <button class="delete-btn" @click="deleteAdminReview(review.id)">
                    삭제
                  </button>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
        <p style="font-size: 12px; color: #888; margin-top: 12px">
          총 {{ filteredReviews.length }}건
        </p>
      </div>

      <!-- ===== 주문 관리 ===== -->
      <div v-if="currentTab === 'orders'">
        <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 16px">
          <input
            v-model="orderStartDate"
            type="date"
            class="search-input"
            style="width: 180px; margin-bottom: 0"
          />
          <span style="color: #888">~</span>
          <input
            v-model="orderEndDate"
            type="date"
            class="search-input"
            style="width: 180px; margin-bottom: 0"
          />
          <button class="save-btn" @click="currentPage = 1" style="padding: 10px 20px">
            조회
          </button>
          <button
            class="save-btn"
            @click="
              orderStartDate = '';
              orderEndDate = '';
              currentPage = 1;
            "
            style="padding: 10px 20px; background: #333; color: #f2f0eb"
          >
            전체
          </button>
        </div>
        <input
          v-model="orderSearch"
          type="text"
          class="search-input"
          placeholder="주문번호, 회원ID, 이름 검색"
          @input="currentPage = 1"
        />
        <table class="member-table">
          <thead>
            <tr>
              <th>주문번호</th>
              <th>회원ID</th>
              <th>이름</th>
              <th>배송지</th>
              <th>결제수단</th>
              <th>금액</th>
              <th>상품</th>
              <th>주문일</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in pagedOrders" :key="order.id">
              <td>#{{ order.id }}</td>
              <td>{{ order.loginId }}</td>
              <td>{{ order.name }}</td>
              <td>{{ order.address }}</td>
              <td>{{ order.payment }}</td>
              <td>{{ order.amount?.toLocaleString() }}원</td>
              <td>
                <span
                  v-for="item in order.orderItems"
                  :key="item.id"
                  style="display: block; font-size: 11px"
                >
                  {{ item.itemName || "상품ID: " + item.itemId }}
                  <span v-if="item.color" style="color: #888">/ {{ item.color }}</span>
                  <span v-if="item.size" style="color: #888">/ {{ item.size }}</span>
                  x {{ item.quantity }}개
                </span>
              </td>
              <td>{{ order.created?.slice(0, 10) }}</td>
              <td>
                <select
                  class="status-select"
                  :value="order.status"
                  @change="updateStatus(order.id, $event.target.value)"
                >
                  <option>주문접수</option>
                  <option>배송중</option>
                  <option>배송완료</option>
                  <option>취소</option>
                </select>
                <button
                  class="delete-btn"
                  @click="deleteOrder(order.id)"
                  style="margin-top: 4px; display: block"
                >
                  삭제
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div style="display: flex; justify-content: center; gap: 8px; margin-top: 24px">
          <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">
            이전
          </button>
          <button
            v-for="page in totalPages"
            :key="page"
            class="page-btn"
            :class="{ active: currentPage === page }"
            @click="currentPage = page"
          >
            {{ page }}
          </button>
          <button
            class="page-btn"
            :disabled="currentPage === totalPages || totalPages === 0"
            @click="currentPage++"
          >
            다음
          </button>
        </div>
        <p style="text-align: center; font-size: 12px; color: #888; margin-top: 12px">
          총 {{ filteredOrders.length }}건
        </p>
      </div>

      <!-- ===== 재고 관리 ===== -->
      <div v-if="currentTab === 'stock'">
        <input
          v-model="stockSearch"
          type="text"
          class="search-input"
          placeholder="상품명 검색"
        />
        <table class="member-table">
          <thead>
            <tr>
              <th>상품ID</th>
              <th>상품명</th>
              <th>가격</th>
              <th>할인율</th>
              <th>재고</th>
              <th>수정</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredItems" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.price?.toLocaleString() }}원</td>
              <td>
                <input
                  v-model="item.discountRate"
                  type="number"
                  class="stock-input"
                  min="0"
                  max="100"
                />%
              </td>
              <td>
                <input v-model="item.stock" type="number" class="stock-input" min="0" />개
              </td>
              <td><button class="save-btn" @click="saveItem(item)">저장</button></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ===== 판매 관리 ===== -->
      <div v-if="currentTab === 'sales'">
        <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 16px">
          <input
            v-model="startDate"
            type="date"
            class="search-input"
            style="width: 180px; margin-bottom: 0"
          />
          <span style="color: #888">~</span>
          <input
            v-model="endDate"
            type="date"
            class="search-input"
            style="width: 180px; margin-bottom: 0"
          />
          <button class="save-btn" @click="loadSales()" style="padding: 10px 20px">
            조회
          </button>
          <button
            class="save-btn"
            @click="
              startDate = '';
              endDate = '';
              loadSales();
            "
            style="padding: 10px 20px; background: #333; color: #f2f0eb"
          >
            전체
          </button>
          <input
            v-model="salesSearch"
            type="text"
            class="search-input"
            placeholder="상품명 검색"
          />
        </div>
        <div style="display: flex; gap: 16px; margin-bottom: 32px">
          <div class="stat-card">
            <p class="stat-label">총 매출</p>
            <p class="stat-value">{{ salesStats.totalAmount.toLocaleString() }}원</p>
          </div>
          <div class="stat-card">
            <p class="stat-label">총 주문수</p>
            <p class="stat-value">{{ salesStats.totalOrders }}건</p>
          </div>
          <div class="stat-card">
            <p class="stat-label">평균 주문금액</p>
            <p class="stat-value">
              {{
                salesStats.totalOrders > 0
                  ? Math.round(
                      salesStats.totalAmount / salesStats.totalOrders
                    ).toLocaleString()
                  : 0
              }}원
            </p>
          </div>
        </div>
        <h3
          style="
            font-family: 'Bebas Neue', sans-serif;
            font-size: 20px;
            color: #f2f0eb;
            margin-bottom: 16px;
            letter-spacing: 0.08em;
          "
        >
          상품별 판매량
        </h3>
        <table class="member-table">
          <thead>
            <tr>
              <th>순위</th>
              <th>상품명</th>
              <th>판매수량</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in filteredProductSales" :key="item.name">
              <td>{{ idx + 1 }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.qty }}개</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ===== 상품 관리 ===== -->
      <div v-if="currentTab === 'items'">
        <!-- 상품 등록 버튼 -->
        <div style="display: flex; justify-content: flex-end; margin-bottom: 16px">
          <button
            class="save-btn"
            style="padding: 10px 20px"
            @click="showItemForm = true"
          >
            상품 등록
          </button>
        </div>

        <!-- 상품 등록/수정 폼 -->
        <div
          v-if="showItemForm"
          class="item-form-box"
          style="
            background: #111;
            border: 1px solid rgba(255, 255, 255, 0.06);
            padding: 24px;
            margin-bottom: 24px;
          "
        >
          <div style="display: flex; flex-direction: column; gap: 16px">
            <div>
              <p class="stat-label">상품명 *</p>
              <input
                v-model="itemForm.name"
                type="text"
                class="search-input"
                style="margin-bottom: 0"
                placeholder="상품명 입력"
              />
            </div>
            <div>
              <p class="stat-label">가격 *</p>
              <input
                v-model="itemForm.price"
                type="number"
                class="search-input"
                style="margin-bottom: 0"
                placeholder="가격 입력"
              />
            </div>
            <div>
              <p class="stat-label">할인율 (%)</p>
              <input
                v-model="itemForm.discountRate"
                type="number"
                class="search-input"
                style="margin-bottom: 0"
                placeholder="0"
                min="0"
                max="100"
              />
            </div>
            <div>
              <p class="stat-label">재고</p>
              <input
                v-model="itemForm.stock"
                type="number"
                class="search-input"
                style="margin-bottom: 0"
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <p class="stat-label">상품 설명</p>
              <textarea
                v-model="itemForm.description"
                class="search-input"
                style="margin-bottom: 0; height: 80px; resize: vertical"
                placeholder="상품 설명 입력"
              ></textarea>
            </div>
            <div>
              <p class="stat-label">카테고리</p>
              <select
                v-model="itemForm.category"
                class="search-input"
                style="margin-bottom: 0"
              >
                <option value="all">전체</option>
                <option value="sunglasses">선글라스</option>
                <option value="eyeglasses">안경</option>
              </select>
            </div>
            <div>
              <p class="stat-label">뱃지</p>
              <select
                v-model="itemForm.badge"
                class="search-input"
                style="margin-bottom: 0"
              >
                <option value="NEW">NEW</option>
                <option value="BEST">BEST</option>
                <option value="SALE">SALE</option>
                <option value="2026 BOUQUET">2026 BOUQUET</option>
                <option value="2025 BOLD">2025 BOLD</option>
                <option value="2025 FALL">2025 FALL</option>
                <option value="DISNEY × F1®">DISNEY × F1®</option>
              </select>
            </div>
            <!-- 세부정보 (key-value 동적 추가) -->
            <div>
              <p class="stat-label">세부정보</p>
              <div
                v-for="(detail, idx) in itemForm.details"
                :key="idx"
                style="display: flex; gap: 8px; margin-bottom: 8px"
              >
                <input
                  v-model="detail.key"
                  type="text"
                  class="search-input"
                  style="margin-bottom: 0; width: 40%"
                  placeholder="항목명 (예: 소재)"
                />
                <input
                  v-model="detail.value"
                  type="text"
                  class="search-input"
                  style="margin-bottom: 0; flex: 1"
                  placeholder="내용 (예: 아세테이트)"
                />
                <button
                  class="delete-btn"
                  style="padding: 4px 10px; flex-shrink: 0"
                  @click="itemForm.details.splice(idx, 1)"
                >
                  ✕
                </button>
              </div>
              <button
                class="save-btn"
                style="margin-top: 4px; padding: 6px 14px"
                @click="itemForm.details.push({ key: '', value: '' })"
              >
                + 항목 추가
              </button>
            </div>
            <div>
              <p class="stat-label">상품 이미지</p>
              <!-- 파일 업로드 -->
              <input
                type="file"
                accept="image/*"
                @change="onImageChange"
                style="color: #f2f0eb; font-size: 13px"
              />
              <!-- URL 입력 -->
              <input
                v-model="itemForm.imageUrl"
                type="text"
                class="search-input"
                style="margin-top: 8px; margin-bottom: 0"
                placeholder="또는 이미지 URL 입력"
                @input="onImageUrlInput"
              />
              <div v-if="imagePreview" style="margin-top: 8px">
                <img
                  :src="imagePreview"
                  style="
                    width: 120px;
                    height: 120px;
                    object-fit: cover;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                  "
                />
              </div>
            </div>
          </div>
          <div
            style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px"
          >
            <button
              class="save-btn"
              style="background: #333; color: #f2f0eb; padding: 8px 20px"
              @click="cancelItemForm"
            >
              취소
            </button>
            <button class="save-btn" style="padding: 8px 20px" @click="submitItem">
              {{ editItemId ? "수정 완료" : "등록" }}
            </button>
          </div>
        </div>

        <!-- 상품 목록 테이블 -->
        <table class="member-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>이미지</th>
              <th>상품명</th>
              <th>가격</th>
              <th>할인율</th>
              <th>재고</th>
              <th>등록일</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in adminItems" :key="item.id">
              <td>{{ item.id }}</td>
              <td>
                <img
                  v-if="item.imagePath"
                  :src="item.imagePath"
                  style="width: 50px; height: 50px; object-fit: cover"
                />
                <span v-else style="color: #555">없음</span>
              </td>
              <td>{{ item.name }}</td>
              <td>{{ item.price?.toLocaleString() }}원</td>
              <td>{{ item.discountRate }}%</td>
              <td>{{ item.stock }}개</td>
              <td>{{ item.createdAt?.slice(0, 10) }}</td>
              <td>
                <button
                  class="save-btn"
                  style="margin-bottom: 4px; display: block"
                  @click="startEditItem(item)"
                >
                  수정
                </button>
                <button class="delete-btn" @click="deleteItem(item.id)">삭제</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { useShopStore } from "@/store/shop";
import { useRouter } from "vue-router";

const store = useShopStore();
const router = useRouter();
const currentTab = ref("members");
const members = ref([]);
const orders = ref([]);
const items = ref([]);

// 검색어
const memberSearch = ref("");
const orderSearch = ref("");
const stockSearch = ref("");
const salesSearch = ref("");

// 판매관리 데이터
const salesStats = ref({ totalAmount: 0, totalOrders: 0 });
const productSales = ref([]);
const startDate = ref("");
const endDate = ref("");
const filteredSalesOrders = ref([]);

// 주문관리 페이징 + 기간 필터
const orderStartDate = ref("");
const orderEndDate = ref("");
const currentPage = ref(1);
const pageSize = 10;

// 상품관리
const adminItems = ref([]);
const showItemForm = ref(false);
const editItemId = ref(null);
const imageFile = ref(null);
const imagePreview = ref(null);
const itemForm = ref({
  name: "",
  price: "",
  discountRate: 0,
  stock: 0,
  description: "",
  imageUrl: "",
  category: "all",
  badge: "NEW",
  details: [], // 세부정보 [{key:'소재', value:'아세테이트'}, ...]
});

// 회원 검색 필터
const filteredMembers = computed(() => {
  if (!memberSearch.value) return members.value;
  const q = memberSearch.value.toLowerCase();
  return members.value.filter(
    (m) =>
      m.name?.toLowerCase().includes(q) ||
      m.loginId?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q)
  );
});

// 기간 필터된 주문 목록
const dateFilteredOrders = computed(() => {
  let filtered = orders.value;
  if (orderStartDate.value)
    filtered = filtered.filter((o) => o.created?.slice(0, 10) >= orderStartDate.value);
  if (orderEndDate.value)
    filtered = filtered.filter((o) => o.created?.slice(0, 10) <= orderEndDate.value);
  return filtered;
});

// 검색 + 기간 필터 적용
const filteredOrders = computed(() => {
  let filtered = dateFilteredOrders.value;
  if (!orderSearch.value) return filtered;
  const q = orderSearch.value.toLowerCase();
  return filtered.filter(
    (o) =>
      String(o.id).includes(q) ||
      o.loginId?.toLowerCase().includes(q) ||
      o.name?.toLowerCase().includes(q)
  );
});

// 페이징 처리
const pagedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredOrders.value.slice(start, start + pageSize);
});

// 총 페이지 수
const totalPages = computed(() => Math.ceil(filteredOrders.value.length / pageSize));

// 재고 검색 필터
const filteredItems = computed(() => {
  if (!stockSearch.value) return items.value;
  const q = stockSearch.value.toLowerCase();
  return items.value.filter((i) => i.name?.toLowerCase().includes(q));
});

// 판매 상품 검색 필터
const filteredProductSales = computed(() => {
  if (!salesSearch.value) return productSales.value;
  const q = salesSearch.value.toLowerCase();
  return productSales.value.filter((i) => i.name?.toLowerCase().includes(q));
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

// 주문 삭제 (관리자)
async function deleteOrder(id) {
  if (!confirm("주문을 삭제하시겠습니까?")) return;
  try {
    const res = await fetch(`/api/order/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      store.showToast("삭제되었습니다.");
      loadOrders();
    }
  } catch (e) {
    store.showToast("오류가 발생했습니다.", "error");
  }
}

// 등급 변경 (관리자)
async function updateGrade(loginId, grade) {
  try {
    const res = await fetch(`/api/member/grade/${loginId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grade }),
    });
    const data = await res.json();
    if (data.success) {
      store.showToast("등급이 변경되었습니다.");
      loadMembers();
    }
  } catch (e) {
    store.showToast("오류가 발생했습니다.", "error");
  }
}

// role 변경 / 강퇴 (관리자)
async function updateRole(loginId, role) {
  const msg = role === "banned" ? "강퇴하시겠습니까?" : "권한을 변경하시겠습니까?";
  if (!confirm(msg)) return;
  try {
    const res = await fetch(`/api/member/role/${loginId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    const data = await res.json();
    if (data.success) {
      store.showToast(role === "banned" ? "강퇴되었습니다." : "권한이 변경되었습니다.");
      loadMembers();
    }
  } catch (e) {
    store.showToast("오류가 발생했습니다.", "error");
  }
}

// 판매 통계 계산
async function loadSales() {
  try {
    const res = await fetch("/api/order/all");
    const allOrders = await res.json();
    let filtered = allOrders;
    if (startDate.value)
      filtered = filtered.filter((o) => o.created?.slice(0, 10) >= startDate.value);
    if (endDate.value)
      filtered = filtered.filter((o) => o.created?.slice(0, 10) <= endDate.value);
    filtered = filtered.filter((o) => o.status !== "취소");
    filteredSalesOrders.value = filtered;
    salesStats.value = {
      totalAmount: filtered.reduce((sum, o) => sum + (o.amount || 0), 0),
      totalOrders: filtered.length,
    };
    const salesMap = {};
    filtered.forEach((order) => {
      order.orderItems?.forEach((item) => {
        const key = item.itemName || "상품ID: " + item.itemId;
        if (!salesMap[key]) salesMap[key] = { name: key, qty: 0, amount: 0 };
        salesMap[key].qty += item.quantity;
        salesMap[key].amount +=
          item.quantity * (order.amount / (order.orderItems?.length || 1));
      });
    });
    productSales.value = Object.values(salesMap).sort((a, b) => b.qty - a.qty);
  } catch (e) {
    console.error(e);
  }
}

// 상품 목록 불러오기 (관리자용)
async function loadAdminItems() {
  try {
    const res = await fetch("/api/item");
    adminItems.value = await res.json();
  } catch (e) {
    console.error(e);
  }
}

// 이미지 파일 선택
function onImageChange(e) {
  const file = e.target.files[0];
  if (!file) return;
  imageFile.value = file;
  imagePreview.value = URL.createObjectURL(file);
  itemForm.value.imageUrl = "";
}

// URL 입력 시 미리보기
function onImageUrlInput() {
  if (itemForm.value.imageUrl) {
    imagePreview.value = itemForm.value.imageUrl;
    imageFile.value = null;
  }
}

// 상품 폼 초기화
function cancelItemForm() {
  showItemForm.value = false;
  editItemId.value = null;
  imageFile.value = null;
  imagePreview.value = null;
  itemForm.value = {
    name: "",
    price: "",
    discountRate: 0,
    stock: 0,
    description: "",
    imageUrl: "",
    category: "all",
    badge: "NEW",
    details: [],
  };
}

// 수정 시작 - 폼으로 스크롤
function startEditItem(item) {
  editItemId.value = item.id;

  // detailsJson → [{key, value}] 배열로 변환
  let details = [];
  if (item.detailsJson) {
    try {
      const obj = JSON.parse(item.detailsJson);
      details = Object.entries(obj).map(([key, value]) => ({
        key,
        value: String(value),
      }));
    } catch (e) {
      details = [];
    }
  }

  itemForm.value = {
    name: item.name,
    price: item.price,
    discountRate: item.discountRate,
    stock: item.stock,
    description: item.description || "",
    imageUrl: item.imagePath?.startsWith("http") ? item.imagePath : "",
    category: item.category || "all",
    badge: item.badge || "NEW",
    details,
  };
  imagePreview.value = item.imagePath || null;
  showItemForm.value = true;
  nextTick(() => {
    const formEl = document.querySelector(".item-form-box");
    if (formEl) formEl.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

// 상품 등록/수정
async function submitItem() {
  if (!itemForm.value.name || !itemForm.value.price) {
    store.showToast("상품명과 가격을 입력해주세요.", "error");
    return;
  }
  try {
    const formData = new FormData();
    formData.append("name", itemForm.value.name);
    formData.append("price", itemForm.value.price);
    formData.append("discountRate", itemForm.value.discountRate || 0);
    formData.append("stock", itemForm.value.stock || 0);
    formData.append("description", itemForm.value.description || "");
    formData.append("category", itemForm.value.category || "all");
    formData.append("badge", itemForm.value.badge || "NEW");
    if (imageFile.value) {
      formData.append("image", imageFile.value);
    } else if (itemForm.value.imageUrl) {
      formData.append("imageUrl", itemForm.value.imageUrl);
    }

    const url = editItemId.value ? `/api/item/${editItemId.value}` : "/api/item";
    const method = editItemId.value ? "PUT" : "POST";
    const res = await fetch(url, { method, body: formData });
    const data = await res.json();

    if (data.success) {
      // 세부정보 별도 저장 (detailsJson으로 변환)
      const itemId = editItemId.value || data.id;
      if (itemForm.value.details.length > 0) {
        const detailsObj = {};
        itemForm.value.details.forEach((d) => {
          if (d.key && d.value) detailsObj[d.key] = d.value;
        });
        await fetch(`/api/item/${itemId}/details`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ detailsJson: JSON.stringify(detailsObj) }),
        });
      }
      store.showToast(editItemId.value ? "수정되었습니다." : "등록되었습니다.");
      cancelItemForm();
      loadAdminItems();
      store.fetchData();
    } else {
      store.showToast(data.message || "오류가 발생했습니다.", "error");
    }
  } catch (e) {
    store.showToast("오류가 발생했습니다.", "error");
  }
}

// 상품 삭제
async function deleteItem(id) {
  if (!confirm("상품을 삭제하시겠습니까?")) return;
  try {
    const res = await fetch(`/api/item/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      store.showToast("삭제되었습니다.");
      loadAdminItems();
      store.fetchData();
    }
  } catch (e) {
    store.showToast("오류가 발생했습니다.", "error");
  }
}

onMounted(() => {
  if (!store.isAdmin) {
    router.push("/");
    return;
  }
  loadMembers();
  loadItems();
  loadOrders();
  store.fetchData();
  const today = new Date().toISOString().slice(0, 10);
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .slice(0, 10);
  startDate.value = firstDayOfMonth;
  endDate.value = today;
  orderStartDate.value = firstDayOfMonth;
  orderEndDate.value = today;
});
// 리뷰 관리
const allReviews = ref([]);
const reviewSearch = ref("");
const editReviewId = ref(null);
const editReviewForm = ref({ content: "", rating: 5 });

// 리뷰 검색 필터 (작성자 이름, 회원ID, 내용으로 검색)
const filteredReviews = computed(() => {
  if (!reviewSearch.value) return allReviews.value;
  const q = reviewSearch.value.toLowerCase();
  return allReviews.value.filter(
    (r) =>
      r.name?.toLowerCase().includes(q) || // 작성자 이름
      r.loginId?.toLowerCase().includes(q) || // 회원ID
      r.content?.toLowerCase().includes(q) // 리뷰 내용
  );
});

// 전체 리뷰 불러오기
async function loadAllReviews() {
  try {
    const res = await fetch("/api/review/all");
    allReviews.value = await res.json();
  } catch (e) {
    console.error(e);
  }
}

// 리뷰 수정 시작
function startAdminReview(review) {
  editReviewId.value = review.id;
  editReviewForm.value = { content: review.content, rating: review.rating };
}

// 리뷰 수정 저장
async function submitAdminReview(id) {
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
      loadAllReviews();
    }
  } catch (e) {
    store.showToast("오류가 발생했습니다.", "error");
  }
}

// 리뷰 삭제
async function deleteAdminReview(id) {
  if (!confirm("리뷰를 삭제하시겠습니까?")) return;
  try {
    const res = await fetch(`/api/review/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      store.showToast("삭제되었습니다.");
      loadAllReviews();
    }
  } catch (e) {
    store.showToast("오류가 발생했습니다.", "error");
  }
}

async function loadMembers() {
  try {
    const res = await fetch("/api/member/list");
    members.value = await res.json();
  } catch (e) {
    console.error(e);
  }
}

async function loadOrders() {
  try {
    const res = await fetch("/api/order/all");
    orders.value = await res.json();
  } catch (e) {
    console.error(e);
  }
}

async function updateStatus(id, status) {
  try {
    const res = await fetch(`/api/order/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.success) {
      store.showToast("상태가 변경되었습니다.");
      loadOrders();
    }
  } catch (e) {
    store.showToast("오류가 발생했습니다.", "error");
  }
}

async function loadItems() {
  try {
    const res = await fetch("/api/item");
    items.value = await res.json();
  } catch (e) {
    console.error(e);
  }
}

async function saveItem(item) {
  try {
    await fetch(`/api/item/${item.id}/stock`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: item.stock }),
    });
    await fetch(`/api/item/${item.id}/discount`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ discountRate: item.discountRate }),
    });
    store.showToast("저장되었습니다.");
    store.fetchData();
  } catch (e) {
    store.showToast("오류가 발생했습니다.", "error");
  }
}
</script>

<style scoped>
.admin-page {
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
.search-input {
  width: 100%;
  background: #111;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #f2f0eb;
  padding: 10px 14px;
  font-size: 13px;
  outline: none;
  margin-bottom: 16px;
}
.search-input::placeholder {
  color: #555;
}
.member-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.member-table th {
  padding: 12px 16px;
  text-align: left;
  color: #888;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 11px;
  letter-spacing: 0.1em;
}
.member-table td {
  padding: 12px 16px;
  color: #f2f0eb;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.member-table tr:hover td {
  background: rgba(255, 255, 255, 0.03);
}
.status-select {
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #f2f0eb;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  outline: none;
}
.stock-input {
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #f2f0eb;
  padding: 4px 8px;
  font-size: 12px;
  width: 70px;
  outline: none;
}
.save-btn {
  background: #f2f0eb;
  color: #0d0d0d;
  border: none;
  padding: 4px 12px;
  font-size: 11px;
  cursor: pointer;
  transition: opacity 0.2s;
}
.save-btn:hover {
  opacity: 0.85;
}
.stat-card {
  background: #111;
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 20px 28px;
  flex: 1;
}
.stat-label {
  font-size: 11px;
  letter-spacing: 0.12em;
  color: #888;
  margin-bottom: 8px;
  text-transform: uppercase;
}
.stat-value {
  font-family: "Bebas Neue", sans-serif;
  font-size: 28px;
  letter-spacing: 0.06em;
  color: #f2f0eb;
  margin: 0;
}
.delete-btn {
  background: #c0392b;
  color: #fff;
  border: none;
  padding: 4px 12px;
  font-size: 11px;
  cursor: pointer;
  transition: opacity 0.2s;
}
.delete-btn:hover {
  opacity: 0.85;
}
.page-btn {
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #888;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.page-btn:hover {
  border-color: #f2f0eb;
  color: #f2f0eb;
}
.page-btn.active {
  background: #f2f0eb;
  color: #0d0d0d;
  border-color: #f2f0eb;
}
.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>
