import {
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';

import { ShiftsService } from './shifts.service';
import { ToggleShiftDto } from './dto/toggle-shift.dto';

import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Shifts')
@Controller('shifts')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Post('start')
  @ApiOperation({
    summary: 'Start a new work shift',
    description: 'Starts a new active shift for a driver.',
  })
  @ApiResponse({
    status: 201,
    description: 'Shift started successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Driver already has an active shift.',
  })
  @ApiNotFoundResponse({
    description: 'Driver not found.',
  })
  async startShift(@Body() dto: ToggleShiftDto) {
    return this.shiftsService.startShift(dto);
  }

  @Post('stop')
  @ApiOperation({
    summary: 'End the current work shift',
    description: 'Stops the currently active shift.',
  })
  @ApiOkResponse({
    description: 'Shift stopped successfully.',
  })
  @ApiBadRequestResponse({
    description: 'No active shift found.',
  })
  async stopShift(@Body() dto: ToggleShiftDto) {
    return this.shiftsService.stopShift(dto);
  }

  @Get('active')
  @ApiOperation({
    summary: 'Retrieve current active shift',
  })
  @ApiQuery({
    name: 'userId',
    example: 'driver-uuid',
  })
  @ApiOkResponse({
    description: 'Current active shift.',
  })
  async getActiveShift(@Query('userId') userId: string) {
    return this.shiftsService.getActiveShift(userId);
  }

  @Get('last')
  @ApiOperation({
    summary: 'Retrieve last completed shift',
  })
  @ApiQuery({
    name: 'userId',
    example: 'driver-uuid',
  })
  @ApiOkResponse({
    description: 'Last completed shift.',
  })
  async getLastShift(@Query('userId') userId: string) {
    return this.shiftsService.getLastShift(userId);
  }
}