import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CreateOrderItemDto {
  @IsString()
  productId!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateOrderDto {
  @IsString()
  @MinLength(2)
  customerName!: string;

  @IsString()
  @MinLength(10)
  customerPhone!: string;

  @IsString()
  @MinLength(8)
  deliveryAddress!: string;

  @IsOptional()
  @IsString()
  deliveryInstructions?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];
}

export class UpdateOrderStatusDto {
  @IsIn([
    'PENDING',
    'CONFIRMED',
    'PREPARING',
    'READY_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
  ])
  orderStatus!: string;

  @IsOptional()
  @IsIn(['PENDING', 'COLLECTED', 'FAILED'])
  paymentStatus?: string;
}
