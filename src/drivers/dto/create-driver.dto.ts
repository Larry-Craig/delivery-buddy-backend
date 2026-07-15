import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export enum TransportationMode {
  BICYCLE = 'BICYCLE',
  MOTORCYCLE = 'MOTORCYCLE',
}

export class CreateDriverDto {
  @ApiProperty({
    example: 'Tyler Teeler',
    description: 'Full name of the driver',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '#IT1567',
    description: 'Unique work ID',
  })
  @IsString()
  @IsNotEmpty()
  workId: string;

  @ApiProperty({
    enum: TransportationMode,
    example: TransportationMode.BICYCLE,
  })
  @IsEnum(TransportationMode)
  transportation: TransportationMode;
}