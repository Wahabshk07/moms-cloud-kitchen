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
            productName: string;
            productImage: string | null;
            unitPrice: number;
            quantity: number;
            totalPrice: number;
            productId: string | null;
            orderId: string;
        }[];
    } & {
        id: string;
        orderNumber: string;
        customerName: string;
        customerPhone: string;
        deliveryAddress: string;
        deliveryInstructions: string | null;
        subtotal: number;
        deliveryFee: number;
        total: number;
        paymentMethod: string;
        paymentStatus: string;
        orderStatus: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    listMine(userId: string): import("../generated/prisma/internal/prismaNamespace.js").PrismaPromise<({
        items: {
            id: string;
            productName: string;
            productImage: string | null;
            unitPrice: number;
            quantity: number;
            totalPrice: number;
            productId: string | null;
            orderId: string;
        }[];
    } & {
        id: string;
        orderNumber: string;
        customerName: string;
        customerPhone: string;
        deliveryAddress: string;
        deliveryInstructions: string | null;
        subtotal: number;
        deliveryFee: number;
        total: number;
        paymentMethod: string;
        paymentStatus: string;
        orderStatus: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    })[]>;
    getMine(userId: string, id: string): Promise<{
        items: {
            id: string;
            productName: string;
            productImage: string | null;
            unitPrice: number;
            quantity: number;
            totalPrice: number;
            productId: string | null;
            orderId: string;
        }[];
    } & {
        id: string;
        orderNumber: string;
        customerName: string;
        customerPhone: string;
        deliveryAddress: string;
        deliveryInstructions: string | null;
        subtotal: number;
        deliveryFee: number;
        total: number;
        paymentMethod: string;
        paymentStatus: string;
        orderStatus: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    listAll(page?: number, limit?: number, status?: string): Promise<{
        items: ({
            items: {
                id: string;
                productName: string;
                productImage: string | null;
                unitPrice: number;
                quantity: number;
                totalPrice: number;
                productId: string | null;
                orderId: string;
            }[];
        } & {
            id: string;
            orderNumber: string;
            customerName: string;
            customerPhone: string;
            deliveryAddress: string;
            deliveryInstructions: string | null;
            subtotal: number;
            deliveryFee: number;
            total: number;
            paymentMethod: string;
            paymentStatus: string;
            orderStatus: string;
            createdAt: Date;
            updatedAt: Date;
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
            productName: string;
            productImage: string | null;
            unitPrice: number;
            quantity: number;
            totalPrice: number;
            productId: string | null;
            orderId: string;
        }[];
    } & {
        id: string;
        orderNumber: string;
        customerName: string;
        customerPhone: string;
        deliveryAddress: string;
        deliveryInstructions: string | null;
        subtotal: number;
        deliveryFee: number;
        total: number;
        paymentMethod: string;
        paymentStatus: string;
        orderStatus: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<{
        items: {
            id: string;
            productName: string;
            productImage: string | null;
            unitPrice: number;
            quantity: number;
            totalPrice: number;
            productId: string | null;
            orderId: string;
        }[];
    } & {
        id: string;
        orderNumber: string;
        customerName: string;
        customerPhone: string;
        deliveryAddress: string;
        deliveryInstructions: string | null;
        subtotal: number;
        deliveryFee: number;
        total: number;
        paymentMethod: string;
        paymentStatus: string;
        orderStatus: string;
        createdAt: Date;
        updatedAt: Date;
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
                productName: string;
                productImage: string | null;
                unitPrice: number;
                quantity: number;
                totalPrice: number;
                productId: string | null;
                orderId: string;
            }[];
        } & {
            id: string;
            orderNumber: string;
            customerName: string;
            customerPhone: string;
            deliveryAddress: string;
            deliveryInstructions: string | null;
            subtotal: number;
            deliveryFee: number;
            total: number;
            paymentMethod: string;
            paymentStatus: string;
            orderStatus: string;
            createdAt: Date;
            updatedAt: Date;
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
