import { type AuthUser } from '../auth/decorators/current-user.decorator.js';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto.js';
import { OrdersService } from './orders.service.js';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    config(): {
        deliveryFee: number;
        paymentMethod: string;
    };
    create(user: AuthUser, dto: CreateOrderDto): Promise<{
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
    mine(user: AuthUser): import("../generated/prisma/internal/prismaNamespace.js").PrismaPromise<({
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
    mineOne(user: AuthUser, id: string): Promise<{
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
    listAll(page?: string, limit?: string, status?: string): Promise<{
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
}
