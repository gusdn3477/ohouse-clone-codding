// DummyJSON API 응답 타입
export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    thumbnail: string;
    images: string[];
    rating: number;
    stock: number;
    brand: string;
    discountPercentage: number;
    // 추가 필드
    sku?: string;
    weight?: number;
    dimensions?: {
        width: number;
        height: number;
        depth: number;
    };
    warrantyInformation?: string;
    shippingInformation?: string;
    availabilityStatus?: string;
    reviews?: Review[];
    returnPolicy?: string;
    minimumOrderQuantity?: number;
    meta?: {
        createdAt: string;
        updatedAt: string;
        barcode: string;
        qrCode: string;
    };
    tags?: string[];
}

export interface Review {
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
}

// DummyJSON 페이지네이션 응답
export interface ProductsResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface CartState {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
}
