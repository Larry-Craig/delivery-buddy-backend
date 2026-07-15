import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Orders & Support Chat')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully.',
  })
  async createOrder(@Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single order' })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Order found.',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found.',
  })
  async getOrder(@Param('id') id: string) {
    return this.ordersService.getOrder(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update an order status' })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
  })
  @ApiBody({
    type: UpdateOrderStatusDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Status updated successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid status.',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found.',
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, dto.status);
  }

  @Post(':id/chat')
  @ApiOperation({ summary: 'Send a support message' })
  @ApiResponse({
    status: 201,
    description: 'Message sent.',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found.',
  })
  async sendMessage(
    @Param('id') id: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.ordersService.sendMessage(id, dto);
  }

  @Get(':id/chat')
  @ApiOperation({ summary: 'Retrieve chat history for an order' })
  @ApiResponse({
    status: 200,
    description: 'Chat history retrieved.',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found.',
  })
  async getMessages(@Param('id') id: string) {
    return this.ordersService.getMessages(id);
  }
}