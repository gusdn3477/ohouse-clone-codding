// 카테고리 관련 유틸리티

export const CATEGORY_NAMES: Record<string, string> = {
  smartphones: '스마트폰',
  laptops: '노트북',
  fragrances: '향수',
  skincare: '스킨케어',
  groceries: '식료품',
  'home-decoration': '홈데코',
  furniture: '가구',
  tops: '상의',
  'womens-dresses': '원피스',
  'womens-shoes': '여성화',
  'mens-shirts': '남성 셔츠',
  'mens-shoes': '남성화',
  'mens-watches': '남성 시계',
  'womens-watches': '여성 시계',
  'womens-bags': '가방',
  'womens-jewellery': '주얼리',
  sunglasses: '선글라스',
  automotive: '자동차용품',
  motorcycle: '오토바이',
  lighting: '조명',
  beauty: '뷰티',
  'kitchen-accessories': '주방용품',
  'sports-accessories': '스포츠용품',
  vehicle: '차량용품',
  tablets: '태블릿',
  'mobile-accessories': '모바일 액세서리',
};

export const CATEGORY_EMOJIS: Record<string, string> = {
  smartphones: '📱',
  laptops: '💻',
  fragrances: '🌸',
  skincare: '🧴',
  groceries: '🛒',
  'home-decoration': '🏠',
  furniture: '🪑',
  tops: '👔',
  'womens-dresses': '👗',
  'womens-shoes': '👠',
  'mens-shirts': '👔',
  'mens-shoes': '👞',
  'mens-watches': '⌚',
  'womens-watches': '⌚',
  'womens-bags': '👜',
  'womens-jewellery': '💎',
  sunglasses: '🕶️',
  automotive: '🚗',
  motorcycle: '🏍️',
  lighting: '💡',
  beauty: '💄',
  'kitchen-accessories': '🍳',
  'sports-accessories': '⚽',
  vehicle: '🚙',
  tablets: '📲',
  'mobile-accessories': '🔌',
};

export function formatCategoryName(category: string): string {
  return CATEGORY_NAMES[category] || category.replace(/-/g, ' ');
}

export function getCategoryEmoji(category: string): string {
  return CATEGORY_EMOJIS[category] || '🛍️';
}
