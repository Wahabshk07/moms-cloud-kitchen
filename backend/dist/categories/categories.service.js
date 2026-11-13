var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ConflictException, Injectable, NotFoundException, } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
let CategoriesService = class CategoriesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    listActive() {
        return this.prisma.category.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
        });
    }
    listAll() {
        return this.prisma.category.findMany({ orderBy: { name: 'asc' } });
    }
    async create(dto) {
        try {
            return await this.prisma.category.create({
                data: {
                    name: dto.name.trim(),
                    image: dto.image,
                    isActive: dto.isActive ?? true,
                },
            });
        }
        catch {
            throw new ConflictException('Category already exists');
        }
    }
    async update(id, dto) {
        await this.ensureExists(id);
        return this.prisma.category.update({
            where: { id },
            data: {
                name: dto.name?.trim(),
                image: dto.image,
                isActive: dto.isActive,
            },
        });
    }
    async remove(id) {
        await this.ensureExists(id);
        const productCount = await this.prisma.product.count({
            where: { categoryId: id },
        });
        if (productCount > 0) {
            return this.prisma.category.update({
                where: { id },
                data: { isActive: false },
            });
        }
        return this.prisma.category.delete({ where: { id } });
    }
    async ensureExists(id) {
        const category = await this.prisma.category.findUnique({ where: { id } });
        if (!category)
            throw new NotFoundException('Category not found');
        return category;
    }
};
CategoriesService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], CategoriesService);
export { CategoriesService };
//# sourceMappingURL=categories.service.js.map