export declare class CreateProductDto {
    name: string;
    description: string;
    image?: string;
    ingredients?: string[];
    price: number;
    categoryId: string;
    isAvailable?: boolean;
    isFeatured?: boolean;
    isPopular?: boolean;
}
export declare class UpdateProductDto {
    name?: string;
    description?: string;
    image?: string;
    ingredients?: string[];
    price?: number;
    categoryId?: string;
    isAvailable?: boolean;
    isFeatured?: boolean;
    isPopular?: boolean;
}
