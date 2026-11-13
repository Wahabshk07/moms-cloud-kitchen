var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsIn, IsInt, IsOptional, IsString, Min, MinLength, ValidateNested, } from 'class-validator';
export class CreateOrderItemDto {
    productId;
    quantity;
}
__decorate([
    IsString(),
    __metadata("design:type", String)
], CreateOrderItemDto.prototype, "productId", void 0);
__decorate([
    Type(() => Number),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], CreateOrderItemDto.prototype, "quantity", void 0);
export class CreateOrderDto {
    customerName;
    customerPhone;
    deliveryAddress;
    deliveryInstructions;
    items;
}
__decorate([
    IsString(),
    MinLength(2),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "customerName", void 0);
__decorate([
    IsString(),
    MinLength(10),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "customerPhone", void 0);
__decorate([
    IsString(),
    MinLength(8),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "deliveryAddress", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "deliveryInstructions", void 0);
__decorate([
    IsArray(),
    ArrayMinSize(1),
    ValidateNested({ each: true }),
    Type(() => CreateOrderItemDto),
    __metadata("design:type", Array)
], CreateOrderDto.prototype, "items", void 0);
export class UpdateOrderStatusDto {
    orderStatus;
    paymentStatus;
}
__decorate([
    IsIn([
        'PENDING',
        'CONFIRMED',
        'PREPARING',
        'READY_FOR_DELIVERY',
        'DELIVERED',
        'CANCELLED',
    ]),
    __metadata("design:type", String)
], UpdateOrderStatusDto.prototype, "orderStatus", void 0);
__decorate([
    IsOptional(),
    IsIn(['PENDING', 'COLLECTED', 'FAILED']),
    __metadata("design:type", String)
], UpdateOrderStatusDto.prototype, "paymentStatus", void 0);
//# sourceMappingURL=order.dto.js.map