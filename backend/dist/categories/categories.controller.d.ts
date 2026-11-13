import { CategoriesService } from './categories.service.js';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto.js';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    listActive(): import("../generated/prisma/internal/prismaNamespace.js").PrismaPromise<{
        name: string;
        id: string;
        image: string | null;
        isActive: boolean;
    }[]>;
    listAll(): import("../generated/prisma/internal/prismaNamespace.js").PrismaPromise<{
        name: string;
        id: string;
        image: string | null;
        isActive: boolean;
    }[]>;
    create(dto: CreateCategoryDto): Promise<{
        name: string;
        id: string;
        image: string | null;
        isActive: boolean;
    }>;
    update(id: string, dto: UpdateCategoryDto): Promise<{
        name: string;
        id: string;
        image: string | null;
        isActive: boolean;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        image: string | null;
        isActive: boolean;
    }>;
}
