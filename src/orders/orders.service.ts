import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private prisma: PrismaService) {}

  async createOrder(dto: CreateOrderDto) {
    return this.prisma.order.create({
      data: dto,
    });
  }

  async getOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateStatus(orderId: string, status: string) {
    const order = await this.getOrder(orderId);

    const updatedOrder = await this.prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status,
      },
    });

    this.logger.log(
      `Order ${order.id} updated to ${status}`,
    );

    return updatedOrder;
  }

  async sendMessage(orderId: string, dto: SendMessageDto) {
    await this.getOrder(orderId);

    return this.prisma.chatMessage.create({
      data: {
        orderId,
        sender: dto.sender,
        message: dto.message,
      },
    });
  }

  async getMessages(orderId: string) {
    await this.getOrder(orderId);

    return this.prisma.chatMessage.findMany({
      where: {
        orderId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}