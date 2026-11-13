import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto.js';
export declare class ProductsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(params: {
        search?: string;
        categoryId?: string;
        availableOnly?: boolean;
        featured?: boolean;
        popular?: boolean;
    }): Promise<({
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
    getById(id: string): Promise<{
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
    private ensureCategory;
}
