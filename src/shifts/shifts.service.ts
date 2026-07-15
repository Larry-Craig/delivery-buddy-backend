import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { ToggleShiftDto } from './dto/toggle-shift.dto';

@Injectable()
export class ShiftsService {
  private readonly logger = new Logger(ShiftsService.name);

  constructor(private readonly prisma: PrismaService) {}

  private async validateDriver(userId: string) {
    const driver = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found.');
    }

    return driver;
  }

  async startShift(dto: ToggleShiftDto) {
    await this.validateDriver(dto.userId);

    const activeShift = await this.prisma.shift.findFirst({
      where: {
        userId: dto.userId,
        status: 'ACTIVE',
      },
    });

    if (activeShift) {
      throw new BadRequestException(
        'You already have an active shift.',
      );
    }

    const shift = await this.prisma.shift.create({
      data: {
        userId: dto.userId,
        status: 'ACTIVE',
        startTime: new Date(),
        earnings: 0,
        tips: 0,
      },
    });

    this.logger.log(
      `Driver ${dto.userId} started shift ${shift.id}`,
    );

    return shift;
  }

  async stopShift(dto: ToggleShiftDto) {
    await this.validateDriver(dto.userId);

    const activeShift = await this.prisma.shift.findFirst({
      where: {
        userId: dto.userId,
        status: 'ACTIVE',
      },
    });

    if (!activeShift) {
      throw new BadRequestException(
        'No active shift found.',
      );
    }

    const completedShift = await this.prisma.shift.update({
      where: {
        id: activeShift.id,
      },
      data: {
        status: 'COMPLETED',
        endTime: new Date(),
      },
    });

    this.logger.log(
      `Driver ${dto.userId} completed shift ${completedShift.id}`,
    );

    return completedShift;
  }

  async getActiveShift(userId: string) {
    await this.validateDriver(userId);

    return this.prisma.shift.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
      },
    });
  }

  async getLastShift(userId: string) {
    await this.validateDriver(userId);

    return this.prisma.shift.findFirst({
      where: {
        userId,
        status: 'COMPLETED',
      },
      orderBy: {
        endTime: 'desc',
      },
    });
  }
}