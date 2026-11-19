export type SportType = 'Football' | 'F1';

export type ProductCategory =
  | 'Jerseys'
  | 'Shorts'
  | 'Socks'
  | 'Grip Socks'
  | 'Hair Bands'
  | 'Jackets'
  | 'Tracksuits'
  | 'Accessories'
  | 'Retro'
  | 'Kids'
  | 'Baby';

export type KitVersion = 'Fan' | 'Player' | 'GK' | 'Retro';
export type SleeveType = 'Short' | 'Long';
export type SeasonType = '2024/25' | '2025/26' | '2026/27' | 'Retro';

export interface ClubDebutMatch {
  opponent: string;
  competition: string;
  date: string;
  stadium: string;
  score: string;
  videoUrl: string;
  summary: string;
}

export interface ClubDiagonalTheme {
  leftColor: string;
  leftColorDeep: string;
  centerColor: string;
  rightColor: string;
  rightColorDeep: string;
  leftTextLight: boolean;
  rightTextLight: boolean;
}

export interface Club {
  slug: string;
  name: string;
  shortWordmark: string;
  sport: SportType;
  league: string;
  country: string;
  city: string;
  foundedYear: number;
  worldRanking: string;
  featuredOnHome: boolean;
  primaryColor: string;
  secondaryColor: string;
  tintColor: string;
  accentGradient: string;
  diagonalTheme?: ClubDiagonalTheme;
  heroImage: string;
  mapViewBox: string;
  mapPath: string;
  debutMatch: ClubDebutMatch;
  editorialNote: string;
}

export interface ProductReview {
  id: string;
  author: string;
  city: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedSize: string;
  photo: string;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  clubSlug: string;
  sport: SportType;
  category: ProductCategory;
  season: SeasonType;
  retroYear?: string;
  priceLkr: number;
  compareAtLkr?: number;
  featuredGroup: 'legends' | 'extended' | 'club';
  description: string;
  fabricSpec: string;
  fitSpec: string;
  careSpec: string;
  images: string[];
  availableVersions: KitVersion[];
  defaultVersion: KitVersion;
  allowSleeveOption: boolean;
  allowPersonalisation: boolean;
  availableSizes: string[];
  bestSellerRank: number;
  isNewArrival: boolean;
  reviews: ProductReview[];
}

export interface CartItem {
  cartKey: string;
  productId: string;
  slug: string;
  name: string;
  clubName: string;
  image: string;
  version: KitVersion;
  sleeve: SleeveType;
  size: string;
  customName: string;
  customNumber: string;
  patches: string[];
  quantity: number;
  unitPriceLkr: number;
}

export interface AddonItem {
  id: string;
  title: string;
  deltaLkr: number;
  subtitle: string;
  detail: string;
}
