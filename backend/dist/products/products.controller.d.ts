import { CreateProductDto, UpdateProductDto } from './dto/product.dto.js';
import { ProductsService } from './products.service.js';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    list(search?: string, categoryId?: string, availableOnly?: string, featured?: string, popular?: string): Promise<({
        category: {
            name: string;
            id: string;
            image: string | null;
            isActive: boolean;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        image: string | null;
        categoryId: string;
        description: string;
        ingredients: string;
        price: number;
        isAvailable: boolean;
        isFeatured: boolean;
        isPopular: boolean;
    } & {
        ingredients: string[];
    })[]>;
    listAll(search?: string, categoryId?: string): Promise<({
        category: {
            name: string;
            id: string;
            image: string | null;
            isActive: boolean;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        image: string | null;
        categoryId: string;
        description: string;
        ingredients: string;
        price: number;
        isAvailable: boolean;
        isFeatured: boolean;
        isPopular: boolean;
    } & {
        ingredients: string[];
    })[]>;
    get(id: string): Promise<{
        category: {
            name: string;
            id: string;
            image: string | null;
            isActive: boolean;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        image: string | null;
        categoryId: string;
        description: string;
        ingredients: string;
        price: number;
        isAvailable: boolean;
        isFeatured: boolean;
        isPopular: boolean;
    } & {
        ingredients: string[];
    }>;
    create(dto: CreateProductDto): Promise<{
        category: {
            name: string;
            id: string;
            image: string | null;
            isActive: boolean;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        image: string | null;
        categoryId: string;
        description: string;
        ingredients: string;
        price: number;
        isAvailable: boolean;
        isFeatured: boolean;
        isPopular: boolean;
    } & {
        ingredients: string[];
    }>;
    update(id: string, dto: UpdateProductDto): Promise<{
        category: {
            name: string;
            id: string;
            image: string | null;
            isActive: boolean;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        image: string | null;
        categoryId: string;
        description: string;
        ingredients: string;
        price: number;
        isAvailable: boolean;
        isFeatured: boolean;
        isPopular: boolean;
    } & {
        ingredients: string[];
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
    upload(file: Express.Multer.File): {
        url: string;
    };
}
