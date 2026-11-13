var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service.js';
import { calculateOrderTotals, lineTotal } from './order-pricing.js';
function orderNumber() {
    const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `MCK-${suffix}`;
}
let OrdersService = class OrdersService {
    prisma;
    config;
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
    }
    async create(userId, dto) {
        if (!dto.items?.length) {
            throw new BadRequestException('Order must contain at least one item');
        }
        const productIds = dto.items.map((i) => i.productId);
        const products = await this.prisma.product.findMany({
            where: { id: { in: productIds } },
        });
        const byId = new Map(products.map((p) => [p.id, p]));
        const lines = dto.items.map((item) => {
            const product = byId.get(item.productId);
            if (!product) {
                throw new BadRequestException(`Product not found: ${item.productId}`);
            }
            if (!product.isAvailable) {
                throw new BadRequestException(`${product.name} is currently unavailable`);
            }
            return {
                productId: product.id,
                productName: product.name,
                productImage: product.image,
                unitPrice: product.price,
                quantity: item.quantity,
                totalPrice: lineTotal(product.price, item.quantity),
            };
        });
        const deliveryFee = Number(this.config.get('DELIVERY_FEE') ?? 50);
        const totals = calculateOrderTotals(lines.map((l) => ({ unitPrice: l.unitPrice, quantity: l.quantity })), deliveryFee);
        return this.prisma.order.create({
            data: {
                orderNumber: orderNumber(),
                userId,
                customerName: dto.customerName.trim(),
                customerPhone: dto.customerPhone.trim(),
                deliveryAddress: dto.deliveryAddress.trim(),
                deliveryInstructions: dto.deliveryInstructions?.trim(),
                subtotal: totals.subtotal,
                deliveryFee: totals.deliveryFee,
                total: totals.total,
                paymentMethod: 'COD',
                paymentStatus: 'PENDING',
                orderStatus: 'PENDING',
                items: { create: lines },
            },
            include: { items: true },
        });
    }
    listMine(userId) {
        return this.prisma.order.findMany({
            where: { userId },
            include: { items: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getMine(userId, id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: { items: true },
        });
        if (!order)
            throw new NotFoundException('Order not found');
        if (order.userId !== userId) {
            throw new ForbiddenException('You cannot access this order');
        }
        return order;
    }
    async listAll(page = 1, limit = 20, status) {
        const take = Math.min(Math.max(limit, 1), 100);
        const skip = (Math.max(page, 1) - 1) * take;
        const where = status ? { orderStatus: status } : {};
        const [items, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                include: { items: true },
                orderBy: { createdAt: 'desc' },
                skip,
                take,
            }),
            this.prisma.order.count({ where }),
        ]);
        return {
            items,
            total,
            page,
            limit: take,
            totalPages: Math.ceil(total / take) || 1,
        };
    }
    async getAny(id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: { items: true },
        });
        if (!order)
            throw new NotFoundException('Order not found');
        return order;
    }
    async updateStatus(id, dto) {
        await this.getAny(id);
        const data = {
            orderStatus: dto.orderStatus,
        };
        if (dto.paymentStatus)
            data.paymentStatus = dto.paymentStatus;
        if (dto.orderStatus === 'DELIVERED' && !dto.paymentStatus) {
            data.paymentStatus = 'COLLECTED';
        }
        return this.prisma.order.update({
            where: { id },
            data,
            include: { items: true },
        });
    }
    async dashboard() {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const [totalOrders, pendingOrders, confirmedOrders, preparingOrders, completedOrders, totalMenuItems, recentOrders, revenueAgg, totalCustomers, activeCustomerGroups, monthOrders,] = await Promise.all([
            this.prisma.order.count(),
            this.prisma.order.count({ where: { orderStatus: 'PENDING' } }),
            this.prisma.order.count({ where: { orderStatus: 'CONFIRMED' } }),
            this.prisma.order.count({ where: { orderStatus: 'PREPARING' } }),
            this.prisma.order.count({ where: { orderStatus: 'DELIVERED' } }),
            this.prisma.product.count(),
            this.prisma.order.findMany({
                include: { items: true },
                orderBy: { createdAt: 'desc' },
                take: 8,
            }),
            this.prisma.order.aggregate({
                _sum: { total: true },
                where: { orderStatus: { not: 'CANCELLED' } },
            }),
            this.prisma.user.count({ where: { role: 'CUSTOMER' } }),
            this.prisma.order.groupBy({
                by: ['userId'],
                where: { createdAt: { gte: thirtyDaysAgo } },
            }),
            this.prisma.order.findMany({
                where: { createdAt: { gte: thirtyDaysAgo }, orderStatus: { not: 'CANCELLED' } },
                select: { createdAt: true, total: true },
                orderBy: { createdAt: 'asc' },
            }),
        ]);
        const buckets = new Map();
        for (let i = 29; i >= 0; i -= 1) {
            const d = new Date();
            d.setHours(0, 0, 0, 0);
            d.setDate(d.getDate() - i);
            buckets.set(d.toISOString().slice(0, 10), 0);
        }
        for (const order of monthOrders) {
            const key = order.createdAt.toISOString().slice(0, 10);
            if (buckets.has(key)) {
                buckets.set(key, (buckets.get(key) ?? 0) + order.total);
            }
        }
        const performance = [...buckets.entries()].map(([date, value]) => ({ date, value }));
        return {
            totalOrders,
            pendingOrders,
            confirmedOrders,
            preparingOrders,
            completedOrders,
            totalMenuItems,
            recentOrders,
            totalRevenue: revenueAgg._sum.total ?? 0,
            totalCustomers,
            activeCustomers: activeCustomerGroups.length,
            performance,
            deliveryFee: Number(this.config.get('DELIVERY_FEE') ?? 50),
        };
    }
    getConfig() {
        return {
            deliveryFee: Number(this.config.get('DELIVERY_FEE') ?? 50),
            paymentMethod: 'COD',
        };
    }
};
OrdersService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        ConfigService])
], OrdersService);
export { OrdersService };
//# sourceMappingURL=orders.service.js.map