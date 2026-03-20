<template>
  <div class="collection-page">

    <section class="collection-hero">
      <video
        v-if="currentCollection.herovideo"
        class="hero-bg-img"
        autoplay muted loop playsinline
        :src="currentCollection.herovideo"
      ></video>
      <img v-else :src="currentCollection.heroImage" class="hero-bg-img" />
      <div class="hero-overlay"></div>
      <div class="hero-text">
        <p class="col-label">{{ currentCollection.season }}</p>
        <h1 class="col-title">{{ currentCollection.title }}</h1>
        <p class="col-desc">{{ currentCollection.desc }}</p>
      </div>
    </section>

    <div class="container">

      <div class="col-tabs">
        <button
          v-for="col in collections"
          :key="col.id"
          class="col-tab"
          :class="{ active: currentId === col.id }"
          @click="currentId = col.id"
        >
          {{ col.name }}
        </button>
      </div>

      <div class="story-section">
        <div
          v-for="(story, idx) in currentCollection.stories"
          :key="idx"
          class="story-block"
          :class="{ reverse: idx % 2 !== 0 }"
        >
          <div class="story-images">
            <div class="story-img-wrap">
              <img :src="story.image1" :alt="story.title" class="story-img" />
            </div>
            <div class="story-img-wrap">
              <img :src="story.image2" :alt="story.title" class="story-img" />
            </div>
          </div>
          <div class="story-text">
            <p class="story-label">{{ story.label }}</p>
            <h2 class="story-title">{{ story.title }}</h2>
            <p class="story-desc">{{ story.desc }}</p>
            <p class="story-extra">{{ story.extraDesc }}</p>
            <RouterLink :to="`/products?category=${story.category}`" class="story-btn">
              {{ story.cta }}
            </RouterLink>
          </div>
        </div>
      </div>

      <div class="col-products">
        <div class="prod-header">
          <div>
            <p class="prod-label">PRODUCTS</p>
            <h2 class="prod-title">{{ currentCollection.name }} 상품</h2>
          </div>
          <RouterLink to="/products" class="prod-link">
            전체 보기 <i class="bi bi-arrow-right"></i>
          </RouterLink>
        </div>
        <div class="row g-3 g-lg-4">
          <div v-for="product in collectionProducts" :key="product.id" class="col-6 col-md-4 col-lg-3">
            <ProductCard :product="product" />
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useShopStore } from '@/store/shop'
import ProductCard from '@/components/ProductCard.vue'

const store = useShopStore()
const route = useRoute()
const currentId = ref('2026')

onMounted(() => { if (route.query.tab) currentId.value = route.query.tab })
watch(() => route.query.tab, v => { if (v) currentId.value = v })

const collections = [
  { id: '2026',     name: '2026 부케 컬렉션' },
  { id: 'fall2025', name: '2025 FALL 컬렉션' },
  { id: 'bold2025', name: '2025 볼드 컬렉션' },
  { id: 'disney',   name: 'Disney × F1® 컬렉션' }
]

const collectionData = {
  '2026': {
    title: '2026 부케 컬렉션', season: '2026 COLLECTION', name: '2026 컬렉션',
    desc: '식물의 줄기를 형상화한 매듭의 고급스러운 디테일로 정제된 우아함을 드러내는 2026 부케 컬렉션.',
    herovideo: `${import.meta.env.BASE_URL}video/main_pc1.mp4`,
    stories: [
      {
        label: 'CHAPTER 01', title: 'Bouquet Collection',
        desc: '젠틀몬스터가 FKA 트위그스와 공동 연출한 캠페인 영상을 통해 2026 부케 컬렉션을 선보입니다.',
        extraDesc: '식물의 줄기를 형상화한 매듭의 고급스러운 디테일과 비즈 장식이 더해진 스테이트먼트 피스에 이르기까지 부드러우면서도 따뜻한 감각을 담은 컬렉션을 선보입니다.',
        image1: 'https://gm-prd-resource.gentlemonster.com/contents/collection/bf7786e6-e36f-463d-8554-175d2202affc/pdp_pc_mo_2160_2700_1.jpg',
        image2: 'https://gm-prd-resource.gentlemonster.com/catalog/product/bulk/a104c37e-6419-423a-af71-874b18f96e3b/11005047_D_45_DETAIL.jpg',
        category: 'eyeglasses', cta: '컬렉션 보기'
      },
      {
        label: 'CHAPTER 02', title: 'Campaignwith. FKA twigs',
        desc: 'FKA 트위그스의 독보적인 예술성과 조던 헤밍웨이의 탐미적인 시선이 만난 캠페인인 만큼, 초현실적 생명력과 피어남의 역동성을 강조하는 것이 핵심입니다.',
        extraDesc: 'FKA 트위그스와 조던 헤밍웨이가 공동 연출한 부케 컬렉션 캠페인은 꽃이 피어나는 모습을 역동적인 퍼포먼스로 재해석하여 초월적인 자연의 현상을 몽환적으로 담아냅니다.',
        image1: 'https://gm-prd-resource.gentlemonster.com/contents/collection/e2213254-9976-4310-ae38-81074bbab15f/pdp_pc_mo_2160_2700_4.jpg',
        image2: 'https://gm-prd-resource.gentlemonster.com/catalog/product/bulk/97dd3b23-2961-4549-a11e-e285f7936386/11005034_D_45_DETAIL.jpg',
        category: 'sunglasses', cta: '상품 보기'
      }
    ]
  },
  'fall2025': {
    title: '2025 FALL 컬렉션', season: '2025 FALL', name: '2025 FALL',
    desc: '미니멀한 실루엣과 정제된 디테일의 프레임으로 확장된 미학을 제시하는 2025 FALL 컬렉션.',
    herovideo: `${import.meta.env.BASE_URL}video/main_pc2.mp4`,
    stories: [
      {
        label: 'FALL 01', title: 'THE HUNT',
        desc: '젠틀몬스터가 헌터 샤퍼와 나디아 리 코헨과 협업한 초단편 영화 THE HUNT 를 통해 2025 FALL 컬렉션을 공개합니다.',
        extraDesc: ' 이번 컬렉션은 더욱 가볍고 섬세해진 실루엣을 강조해 새로운 고급스러움을 제안합니다. 얇아진 프레임에 과하지 않은 디테일을 더하여 세련되고 절제된 미학으로 승화하며, 에너지가 느껴지는 메탈릭한 컬러웨이로 감각적인 조화를 형성합니다.',
        image1: 'https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section2/story_3_campaign_imgs_pc_1600x1080.jpg',
        image2: 'https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section4/story_4_product_imgs_1080_1350.jpg',
        category: 'eyeglasses', cta: '컬렉션 보기'
      },
      {
        label: 'FALL 02', title: 'REFINED DETAIL',
        desc: '소재와 형태의 균형을 탐구하며 일상 속 특별함을 선사하는 가을 시즌 라인업.',
        extraDesc: '섬세한 디테일이 만들어내는 완성도. 가을의 깊이를 닮은 프레임으로 매일의 스타일을 완성하세요.',
        image1: 'https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section2/story_4_campaign_imgs_pc_1600x1080.jpg',
        image2: 'https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section4/story_5_product_imgs_1080_1350.jpg',
        category: 'eyeglasses', cta: '상품 보기'
      }
    ]
  },
  'bold2025': {
    title: '2025 볼드 컬렉션', season: 'BOLD 2025', name: '2025 BOLD',
    desc: '2025 볼드 컬렉션을 지금 만나보세요',
    herovideo: `${import.meta.env.BASE_URL}video/main_pc3.mp4`,
    stories: [
      {
        label: 'BOLD 01', title: 'NEW FUTURISM',
        desc: '노즈패드를 삭제하는 구조의 혁신을 통해 뉴 퓨처리즘을 제안합니다.',
        extraDesc: '배우 틸다 스윈튼과 함께한 볼드 컬렉션 캠페인은 그녀의 압도적인 존재감이 파동감 넘치는 사운드와 조우하며, 관중과 함께 새로운 시대를 맞이하는 대규모 셀러브레이션을 구현합니다.',
        image1: 'https://gm-prd-resource.gentlemonster.com/assets/stories/bold/image/campaign-carousel2.jpg',
        image2: 'https://gm-prd-resource.gentlemonster.com/catalog/product/0MKYDKBMVG26D/f2e86251-8a2d-4473-8c2f-bd0999121f27/11004650_D_45_DETAIL.jpg',
        category: 'sunglasses', cta: '상품 보기'
      },
      {
        label: 'BOLD 02', title: 'SHIELD STRUCTURE',
        desc: '방패의 구조에서 영감을 받은 브릿지 디테일. 강렬하고 입체적인 실루엣이 시선을 사로잡습니다.',
        extraDesc: '볼드 컬렉션은 현대적으로 재해석한 방패의 구조를 형상화하며, 노즈패드 삭제라는 혁신을 통해 뉴 퓨처리즘을 제안합니다. 메탈 프레임은 가벼운 렌즈와 대비되는 묵직하고 정교한 브릿지 디자인으로 독창적인 대비를 보여주며, 아세테이트 프레임은 과장된 볼륨의 프론트와 속도감을 강조한 시그니처 심볼을 통해 미래적 감각을 구현합니다.',
        image1: 'https://gm-prd-resource.gentlemonster.com/contents/collection/463dcef2-2d3a-49ac-900f-62f93a3b7410/pdp_0.jpg',
        image2: 'https://gm-prd-resource.gentlemonster.com/catalog/product/bulk/b2602e09-90bc-40c2-8a1c-8aa141b976ac/11004720_D_45_DETAIL.jpg',
        category: 'sunglasses', cta: '컬렉션 보기'
      }
    ]
  },
  'disney': {
    title: 'Disney × F1® 컬렉션', season: 'Disney × F1® COLLABORATION', name: 'Disney × F1®',
    desc: 'Disney × F1®과의 글로벌 협업을 통해 서킷 컬렉션을 선보입니다. 레이싱 카의 구조적 요소들을 젠틀몬스터만의 시선으로 재해석하였으며, 스포츠와 패션의 경계를 초월한 강렬한 미학을 제안합니다.',
    herovideo: `${import.meta.env.BASE_URL}video/main_pc.mp4`,
    stories: [
      {
        label: 'Disney × F1® 01', title: 'CIRCUIT COLLECTION',
        desc: '질주하는 서킷 위의 폭발적인 에너지를 담은 컬렉션. 견고하면서도 가벼운 소재를 적용했습니다.',
        extraDesc: '디즈니의 창의성과 F1®의 역동성이 만나 탄생한 특별한 협업. 레이싱의 스피드를 일상에 담아냅니다.',
        image1: ' https://gm-prd-resource.gentlemonster.com/catalog/product/bulk/d4d59d83-cd64-49f2-8a8b-44e9c5239575/11005049_D_45_DETAIL.jpg',
        image2: 'https://gm-prd-resource.gentlemonster.com/catalog/product/bulk/0be727e9-b37e-42d6-94f8-982110129d3c/11005049_SIDE.jpg',
        category: 'collaboration', cta: '컬렉션 보기'
      },
      {
        label: 'Disney × F1® 02', title: 'SLIPSTREAM',
        desc: '공기역학적 설계에서 영감을 받은 프레임. 속도와 스타일의 완벽한 조화를 선보입니다.',
        extraDesc: '서킷을 달리는 머신처럼 정교하게 설계된 프레임. 일상 속에서 레이싱의 열정을 느껴보세요.',
        image1: 'https://gm-prd-resource.gentlemonster.com/catalog/product/bulk/f2e2e109-9b73-4254-b677-3f7c53fd386a/11005060_D_45_DETAIL.jpg',
        image2: 'https://gm-prd-resource.gentlemonster.com/catalog/product/bulk/e39f1de1-412e-4f9a-9fe2-30aff38f3ea8/11005060_SIDE.jpg',
        category: 'collaboration', cta: '상품 보기'
      }
    ]
  }
}

const currentCollection = computed(() => collectionData[currentId.value])
const collectionProducts = computed(() => store.products.slice(0, 4))
</script>

<style scoped>
.collection-page { padding-bottom: 80px; }

/* 히어로 */
.collection-hero {
  position: relative;
  height: 70vh;
  min-height: 480px;
  overflow: hidden;
}

.hero-bg-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 100%);
  z-index: 1;
}

.hero-text {
  position: absolute;
  bottom: 56px;
  left: 0; right: 0;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  z-index: 2;
}

.col-label {
  font-size: 11px;
  letter-spacing: 0.25em;
  color: rgba(242,240,235,0.7);
  margin-bottom: 10px;
}

.col-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(2.5rem, 5vw, 5rem);
  letter-spacing: 0.05em;
  color: #f2f0eb;
  margin-bottom: 14px;
}

.col-desc {
  font-size: 14px;
  color: rgba(242,240,235,0.75);
  max-width: 520px;
  margin: 0;
  line-height: 1.7;
}

/* 탭 */
.col-tabs {
  display: flex;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  margin-bottom: 56px;
}

.col-tab {
  padding: 16px 24px;
  font-size: 12px;
  letter-spacing: 0.1em;
  color: #888;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: -1px;
  white-space: nowrap;
}

.col-tab.active { color: #f2f0eb; border-bottom-color: #f2f0eb; }

/* 스토리 */
.story-section {
  display: flex;
  flex-direction: column;
  gap: 100px;
  margin-bottom: 80px;
}

.story-block {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 56px;
  align-items: center;
}

.story-block.reverse { direction: rtl; }
.story-block.reverse > * { direction: ltr; }

.story-images {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.story-img-wrap {
  overflow: hidden;
  aspect-ratio: 4 / 3;
}

.story-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}

.story-img-wrap:hover .story-img { transform: scale(1.03); }

.story-text {
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.story-label { font-size: 11px; letter-spacing: 0.2em; color: #888; margin: 0; }

.story-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(2rem, 3vw, 3rem);
  letter-spacing: 0.06em;
  color: #f2f0eb;
  margin: 0;
}

.story-desc { font-size: 14px; color: #888; line-height: 1.8; margin: 0; }

.story-extra {
  font-size: 13px;
  color: #666;
  line-height: 1.8;
  margin: 0;
  padding-top: 14px;
  border-top: 1px solid rgba(255,255,255,0.06);
}

.story-btn {
  display: inline-block;
  padding: 12px 32px;
  background: #f2f0eb;
  color: #0d0d0d;
  font-size: 12px;
  letter-spacing: 0.1em;
  text-decoration: none;
  transition: opacity 0.2s;
  align-self: flex-start;
}

.story-btn:hover { opacity: 0.85; }

/* 상품 */
.col-products {
  padding-top: 56px;
  border-top: 1px solid rgba(255,255,255,0.08);
}

.prod-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;
}

.prod-label { font-size: 11px; letter-spacing: 0.2em; color: #888; margin-bottom: 4px; }

.prod-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 28px;
  letter-spacing: 0.08em;
  color: #f2f0eb;
  margin: 0;
}

.prod-link { font-size: 12px; color: #888; text-decoration: none; transition: color 0.2s; }
.prod-link:hover { color: #f2f0eb; }

/* 모바일 */
@media (max-width: 768px) {
  .collection-hero { height: 55vh; }
  .story-block, .story-block.reverse { grid-template-columns: 1fr; direction: ltr; }
}
</style>