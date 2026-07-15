import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

export class ToggleShiftDto {
  @ApiProperty({
    example: '4ef70b8c-fb2b-43af-91d3-5e23d6c6b5cb',
    description: 'Driver database ID',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}