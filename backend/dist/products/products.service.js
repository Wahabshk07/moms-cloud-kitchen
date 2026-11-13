var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
function parseIngredients(raw) {
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed)
            ? parsed.filter((i) => typeof i === 'string')
            : [];
    }
    catch {
        return [];
    }
}
function mapProduct(product) {
    return {
        ...product,
        ingredients: parseIngredients(product.ingredients),
    };
}
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(params) {
        const products = await this.prisma.product.findMany({
            where: {
                ...(params.availableOnly ? { isAvailable: true } : {}),
                ...(params.categoryId ? { categoryId: params.categoryId } : {}),
                ...(params.featured ? { isFeatured: true } : {}),
                ...(params.popular ? { isPopular: true } : {}),
                ...(params.search
                    ? {
                        OR: [
                            { name: { contains: params.search } },
                            { description: { contains: params.search } },
                        ],
                    }
                    : {}),
            },
            include: { category: true },
            orderBy: { name: 'asc' },
        });
        return products.map(mapProduct);
    }
    async getById(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { category: true },
        });
        if (!product)
            throw new NotFoundException('Product not found');
        return mapProduct(product);
    }
    async create(dto) {
        await this.ensureCategory(dto.categoryId);
        const product = await this.prisma.product.create({
            data: {
                name: dto.name.trim(),
                description: dto.description.trim(),
                image: dto.image,
                ingredients: JSON.stringify(dto.ingredients ?? []),
                price: dto.price,
                categoryId: dto.categoryId,
                isAvailable: dto.isAvailable ?? true,
                isFeatured: dto.isFeatured ?? false,
                isPopular: dto.isPopular ?? false,
            },
            include: { category: true },
        });
        return mapProduct(product);
    }
    async update(id, dto) {
        await this.getById(id);
        if (dto.categoryId)
            await this.ensureCategory(dto.categoryId);
        const product = await this.prisma.product.update({
            where: { id },
            data: {
                name: dto.name?.trim(),
                description: dto.description?.trim(),
                image: dto.image,
                ingredients: dto.ingredients !== undefined
                    ? JSON.stringify(dto.ingredients)
                    : undefined,
                price: dto.price,
                categoryId: dto.categoryId,
                isAvailable: dto.isAvailable,
                isFeatured: dto.isFeatured,
                isPopular: dto.isPopular,
            },
            include: { category: true },
        });
        return mapProduct(product);
    }
    async remove(id) {
        await this.getById(id);
        await this.prisma.product.delete({ where: { id } });
        return { success: true };
    }
    async ensureCategory(id) {
        const category = await this.prisma.category.findUnique({ where: { id } });
        if (!category)
            throw new NotFoundException('Category not found');
    }
};
ProductsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], ProductsService);
export { ProductsService };
//# sourceMappingURL=products.service.js.map