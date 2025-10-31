
export interface Variation {
  name: string;
  price: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  variations: Variation[];
  startingPrice: string;
}

export interface TherapyService {
  id: string;
  name: string;
  description: string;
  durationMins: string;
  price: string;
  imageUrl: string;
  variations: Variation[];
  startingPrice: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  datePublished: Date;
  content: string;
}

export interface ServicePackageInfo {
  name: string;
  features: string[];
}

export interface ServiceHighlight {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  iconUrl: string;
  packages: ServicePackageInfo[];
  backgroundColor: string; // Storing as hex string
  displayOrder: number;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  testimonial: string;
  imageUrl: string;
}

export enum CartItemType {
  Product = 'product',
  Service = 'service'
}

export interface CartItem {
  id: string;
  cartItemId: string; // Unique ID for cart instance (productID + variationName)
  name: string;
  imageUrl: string;
  selectedVariation: Variation;
  itemType: CartItemType;
  quantity: number;
  totalPrice: number;
}
