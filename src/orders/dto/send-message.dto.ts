import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({ example: 'DRIVER', enum: ['DRIVER', 'SUPPORT'] })
  @IsString()
  @IsIn(['DRIVER', 'SUPPORT'])
  sender: string;

  @ApiProperty({ example: 'Hi, cannot reach the customer. Here for 15 mins already.' })
  @IsString()
  @IsNotEmpty()
  message: string;
}