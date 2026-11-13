import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto.js';

function parseIngredients(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((i): i is string => typeof i === 'string')
      : [];
  } catch {
    return [];
  }
}

function mapProduct<T extends { ingredients: string }>(product: T) {
  return {
    ...product,
    ingredients: parseIngredients(product.ingredients),
  };
}

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(params: {
    search?: string;
    categoryId?: string;
    availableOnly?: boolean;
    featured?: boolean;
    popular?: boolean;
  }) {
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

  async getById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return mapProduct(product);
  }

  async create(dto: CreateProductDto) {
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

  async update(id: string, dto: UpdateProductDto) {
    await this.getById(id);
    if (dto.categoryId) await this.ensureCategory(dto.categoryId);
    const product = await this.prisma.product.update({
      where: { id },
      data: {
        name: dto.name?.trim(),
        description: dto.description?.trim(),
        image: dto.image,
        ingredients:
          dto.ingredients !== undefined
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

  async remove(id: string) {
    await this.getById(id);
    await this.prisma.product.delete({ where: { id } });
    return { success: true };
  }

  private async ensureCategory(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
  }
}
