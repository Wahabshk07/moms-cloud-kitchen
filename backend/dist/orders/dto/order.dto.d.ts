export declare class CreateOrderItemDto {
    productId: string;
    quantity: number;
}
export declare class CreateOrderDto {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    deliveryInstructions?: string;
    items: CreateOrderItemDto[];
}
export declare class UpdateOrderStatusDto {
    orderStatus: string;
    paymentStatus?: string;
}
