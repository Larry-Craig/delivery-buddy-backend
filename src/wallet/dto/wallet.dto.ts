import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsUUID,
} from 'class-validator';

export class WithdrawDto {
  @ApiProperty({
    example: '4ef70b8c-fb2b-43af-91d3-5e23d6c6b5cb',
    description: 'Driver database ID',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: 100,
    description: 'Withdrawal amount',
  })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  amount: number;
}