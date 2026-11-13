import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto.js';
export declare class OrdersService {
    private readonly prisma;
    private readonly config;
    constructor(prisma: PrismaService, config: ConfigService);
    create(userId: string, dto: CreateOrderDto): Promise<{
        items: {
            id: string;
            productId: string | null;
            quantity: number;
            productName: string;
            productImage: string | null;
            unitPrice: number;
            totalPrice: number;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        customerName: string;
        customerPhone: string;
        deliveryAddress: string;
        deliveryInstructions: string | null;
        orderStatus: string;
        paymentStatus: string;
        orderNumber: string;
        subtotal: number;
        deliveryFee: number;
        total: number;
        paymentMethod: string;
        userId: string;
    }>;
    listMine(userId: string): import("../generated/prisma/internal/prismaNamespace.js").PrismaPromise<({
        items: {
            id: string;
            productId: string | null;
            quantity: number;
            productName: string;
            productImage: string | null;
            unitPrice: number;
            totalPrice: number;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        customerName: string;
        customerPhone: string;
        deliveryAddress: string;
        deliveryInstructions: string | null;
        orderStatus: string;
        paymentStatus: string;
        orderNumber: string;
        subtotal: number;
        deliveryFee: number;
        total: number;
        paymentMethod: string;
        userId: string;
    })[]>;
    getMine(userId: string, id: string): Promise<{
        items: {
            id: string;
            productId: string | null;
            quantity: number;
            productName: string;
            productImage: string | null;
            unitPrice: number;
            totalPrice: number;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        customerName: string;
        customerPhone: string;
        deliveryAddress: string;
        deliveryInstructions: string | null;
        orderStatus: string;
        paymentStatus: string;
        orderNumber: string;
        subtotal: number;
        deliveryFee: number;
        total: number;
        paymentMethod: string;
        userId: string;
    }>;
    listAll(page?: number, limit?: number, status?: string): Promise<{
        items: ({
            items: {
                id: string;
                productId: string | null;
                quantity: number;
                productName: string;
                productImage: string | null;
                unitPrice: number;
                totalPrice: number;
                orderId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            customerName: string;
            customerPhone: string;
            deliveryAddress: string;
            deliveryInstructions: string | null;
            orderStatus: string;
            paymentStatus: string;
            orderNumber: string;
            subtotal: number;
            deliveryFee: number;
            total: number;
            paymentMethod: string;
            userId: string;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getAny(id: string): Promise<{
        items: {
            id: string;
            productId: string | null;
            quantity: number;
            productName: string;
            productImage: string | null;
            unitPrice: number;
            totalPrice: number;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        customerName: string;
        customerPhone: string;
        deliveryAddress: string;
        deliveryInstructions: string | null;
        orderStatus: string;
        paymentStatus: string;
        orderNumber: string;
        subtotal: number;
        deliveryFee: number;
        total: number;
        paymentMethod: string;
        userId: string;
    }>;
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<{
        items: {
            id: string;
            productId: string | null;
            quantity: number;
            productName: string;
            productImage: string | null;
            unitPrice: number;
            totalPrice: number;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        customerName: string;
        customerPhone: string;
        deliveryAddress: string;
        deliveryInstructions: string | null;
        orderStatus: string;
        paymentStatus: string;
        orderNumber: string;
        subtotal: number;
        deliveryFee: number;
        total: number;
        paymentMethod: string;
        userId: string;
    }>;
    dashboard(): Promise<{
        totalOrders: number;
        pendingOrders: number;
        confirmedOrders: number;
        preparingOrders: number;
        completedOrders: number;
        totalMenuItems: number;
        recentOrders: ({
            items: {
                id: string;
                productId: string | null;
                quantity: number;
                productName: string;
                productImage: string | null;
                unitPrice: number;
                totalPrice: number;
                orderId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            customerName: string;
            customerPhone: string;
            deliveryAddress: string;
            deliveryInstructions: string | null;
            orderStatus: string;
            paymentStatus: string;
            orderNumber: string;
            subtotal: number;
            deliveryFee: number;
            total: number;
            paymentMethod: string;
            userId: string;
        })[];
        totalRevenue: number;
        totalCustomers: number;
        activeCustomers: number;
        performance: {
            date: string;
            value: number;
        }[];
        deliveryFee: number;
    }>;
    getConfig(): {
        deliveryFee: number;
        paymentMethod: string;
    };
}
