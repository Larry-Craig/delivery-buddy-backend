import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum OrderStatus {
  PENDING = 'PENDING',
  DELIVERING = 'DELIVERING',
  DELIVERED = 'DELIVERED',
}

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: OrderStatus,
    example: OrderStatus.DELIVERING,
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}