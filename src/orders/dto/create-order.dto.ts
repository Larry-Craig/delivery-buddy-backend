import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ example: 'Lazzy Pizza', description: 'Pickup merchant' })
  @IsString()
  @IsNotEmpty()
  pickupName: string;

  @ApiProperty({ example: '123 Pizza St.', description: 'Pickup address' })
  @IsString()
  @IsNotEmpty()
  pickupAddress: string;

  @ApiProperty({ example: 'Mrs. Jonson', description: 'Customer name' })
  @IsString()
  @IsNotEmpty()
  destinationName: string;

  @ApiProperty({ example: '1142 Madison Ave, 2nd floor, app. 34', description: 'Delivery address' })
  @IsString()
  @IsNotEmpty()
  destinationAddress: string;

  @ApiProperty({ 
    example: '[{"name": "Ham and Cheese Pizza 11 inch", "price": 12, "qty": 2}, {"name": "Pepperoni Pepper", "price": 10, "qty": 1}]',
    description: 'JSON String containing items array' 
  })
  @IsString()
  @IsNotEmpty()
  itemsJson: string;

  @ApiProperty({ example: 42.0 })
  @IsNumber()
  total: number;

  @ApiProperty({ example: 10.0 })
  @IsNumber()
  tip: number;
}