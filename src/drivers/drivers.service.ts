import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateDriverDto } from './dto/create-driver.dto';

@Injectable()
export class DriversService {
  private readonly logger = new Logger(DriversService.name);

  constructor(private readonly prisma: PrismaService) {}

  async register(dto: CreateDriverDto) {
    const existingDriver = await this.prisma.user.findUnique({
      where: {
        workId: dto.workId,
      },
    });

    if (existingDriver) {
      throw new ConflictException(
        'A driver with this work ID already exists.',
      );
    }

    const driver = await this.prisma.user.create({
      data: {
        name: dto.name,
        workId: dto.workId,
        transportation: dto.transportation,
        walletBalance: 487.67,
        tipsBalance: 276.78,
      },
    });

    this.logger.log(
      `Driver registered successfully (${driver.workId})`,
    );

    return driver;
  }

  async findOne(id: string) {
    const driver = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!driver) {
      throw new NotFoundException(
        `Driver with ID ${id} not found.`,
      );
    }

    return driver;
  }

  async findByWorkId(workId: string) {
    const driver = await this.prisma.user.findUnique({
      where: {
        workId,
      },
    });

    if (!driver) {
      throw new NotFoundException(
        `Driver with Work ID ${workId} not found.`,
      );
    }

    return driver;
  }
}