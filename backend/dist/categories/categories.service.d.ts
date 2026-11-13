import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto.js';
export declare class CategoriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    private ensureExists;
}
