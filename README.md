# Gentle Monster Inspired - 쇼핑몰 포트폴리오 (Frontend)

> 젠틀몬스터를 디자인 레퍼런스로 참고하여, 전체 기능과 아키텍처는 직접 설계 및 구현한 풀스택 쇼핑몰 포트폴리오입니다.
> 
> **Frontend Repository:** [portfolio_shop](https://github.com/dhwldrjekd1/portfolio_shop)

---

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | Gentle Monster Inspired 쇼핑몰 |
| 개발 기간 | 2026.03 |
| 개발자    | 최동윤 |
| 개발 인원 | 1인 (풀스택) |
| 배포 환경 | Docker (Ubuntu 컨테이너) |
| 접속 URL | `http://localhost:8086/web03/` |

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| Framework | Vue.js 3 (Composition API, `<script setup>`) |
| 상태 관리 | Pinia |
| 라우팅 | Vue Router 4 (SPA 라우팅, 라우터 가드) |
| 빌드 도구 | Vite |
| UI | Bootstrap 5, Bootstrap Icons |

---

## 프로젝트 구조

```
src/
├── views/                  # 페이지 컴포넌트
│   ├── HomeView.vue         # 메인 (Hero 슬라이드, 신상품/베스트)
│   ├── ProductView.vue      # 상품 목록 (필터/정렬)
│   ├── ProductDetailView.vue # 상품 상세 (옵션선택, 리뷰)
│   ├── CartView.vue         # 장바구니
│   ├── CheckoutView.vue     # 결제 (3단계)
│   ├── OrderCompleteView.vue # 주문 완료
│   ├── MyPageView.vue       # 마이페이지
│   ├── AdminView.vue        # 관리자 대시보드
│   ├── BoardView.vue        # 고객지원 (공지/QnA/문의)
│   └── CommunityView.vue    # 커뮤니티
├── components/
│   ├── AppHeader.vue        # 헤더 (로그인 모달 포함)
│   └── ProductCard.vue      # 상품 카드
├── store/
│   └── shop.js              # Pinia 전역 상태
├── router/
│   └── index.js             # 라우터 설정 (가드 포함)
└── public/
    └── products.json        # 상품 기본 데이터 (DB와 합치기)
```

---

## 구현 기능

### 회원
- 회원가입 / 로그인 / 로그아웃
- 마이페이지 (회원정보 조회/수정, 회원탈퇴)
- 비밀번호 찾기 (임시 비밀번호 발급)
- 구매금액 기반 자동 등급 업데이트 (브론즈/실버/골드/플래티넘)
- 라우터 가드 (비로그인/비관리자 접근 차단)

### 상품
- 상품 목록 (카테고리/뱃지/가격/평점 필터, 정렬)
- 상품 상세 (이미지 갤러리, 색상/사이즈 선택)
- 할인가 표시 (원가 취소선 + 할인가 + %OFF)
- DB 기반 재고/할인율/가격/별점 실시간 반영
- 관리자 신규 등록 상품 자동 표시

### 장바구니
- 장바구니 담기 / 수량 변경 / 삭제
- DB 기반 (새로고침 후에도 유지)
- 비로그인 시 로그인 모달 표시

### 주문/결제
- 3단계 결제 프로세스 (배송정보 → 결제수단 → 확인)
- 배송 메모 (선택형 + 직접 입력)
- 주문완료 페이지 (주문 상품 이미지 표시)
- 주문 취소 (주문접수/배송중 상태만 가능)

### 리뷰
- 배송완료 주문 확인 후 리뷰 작성
- 동일 상품 중복 리뷰 방지
- 리뷰 수정 / 삭제
- DB 기반 평균 별점 표시

### 고객지원
- 공지사항 / QnA / 고객문의

### 관리자 대시보드 (6개 탭)
- 회원 목록 / 주문 관리 / 재고 관리
- 판매 관리 / 상품 관리 / 리뷰 관리

---

## 빌드 및 배포

```bash
# Vue 빌드
npm run build

# dist → Spring Boot static 복사 (Windows)
xcopy /E /Y dist\* ..\shop\src\main\resources\static\web03\
```

---

## 환경 설정

```javascript
// vite.config.js
base: '/web03/'
```

---

## 연관 레포지토리

| 구분 | 링크 |
|------|------|
| Backend | [portfolio_shop](https://github.com/dhwldrjekd1/portfolio_shop) |
