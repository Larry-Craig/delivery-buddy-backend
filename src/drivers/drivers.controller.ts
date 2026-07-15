import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';

import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Drivers')
@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new driver',
    description:
      'Creates a new driver account using a unique work ID.',
  })
  @ApiResponse({
    status: 201,
    description: 'Driver registered successfully.',
  })
  @ApiConflictResponse({
    description: 'Work ID already exists.',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed.',
  })
  async register(@Body() dto: CreateDriverDto) {
    return this.driversService.register(dto);
  }

  @Get('login')
  @ApiOperation({
    summary: 'Driver login using Work ID',
  })
  @ApiQuery({
    name: 'workId',
    example: '#IT1567',
  })
  @ApiOkResponse({
    description: 'Driver found.',
  })
  @ApiNotFoundResponse({
    description: 'Driver not found.',
  })
  async login(@Query('workId') workId: string) {
    return this.driversService.findByWorkId(workId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve driver profile',
  })
  @ApiOkResponse({
    description: 'Driver profile retrieved successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Driver not found.',
  })
  async getProfile(@Param('id') id: string) {
    return this.driversService.findOne(id);
  }
}