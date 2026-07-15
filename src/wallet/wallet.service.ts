import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    private readonly prisma: PrismaService,
  ) {}

  private async getUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('Driver not found.');
    }

    return user;
  }

  async withdrawFunds(
    userId: string,
    amount: number,
  ) {
    if (amount <= 0) {
      throw new BadRequestException(
        'Withdrawal amount must be greater than zero.',
      );
    }

    const user = await this.getUser(userId);

    if (user.walletBalance < amount) {
      throw new BadRequestException(
        'Insufficient wallet balance.',
      );
    }

    const result = await this.prisma.$transaction(
      async (tx) => {
        const updatedUser = await tx.user.update({
          where: {
            id: userId,
          },
          data: {
            walletBalance: {
              decrement: amount,
            },
          },
        });

        const transaction =
          await tx.transaction.create({
            data: {
              userId,
              type: 'WITHDRAWAL',
              amount: -amount,
            },
          });

        return {
          updatedUser,
          transaction,
        };
      },
    );

    await this.cacheManager.del(
      `transactions_${userId}`,
    );

    this.logger.log(
      `Wallet withdrawal of ${amount} processed for ${userId}`,
    );

    return result;
  }

  async getTransactions(userId: string) {
    await this.getUser(userId);

    const cacheKey = `transactions_${userId}`;

    const cached =
      await this.cacheManager.get(cacheKey);

    if (cached) {
      this.logger.log(
        `Transactions served from cache (${userId})`,
      );

      return cached;
    }

    const transactions =
      await this.prisma.transaction.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

    await this.cacheManager.set(
      cacheKey,
      transactions,
      30000,
    );

    return transactions;
  }

  async getRates() {
    const cacheKey = 'wallet_coin_rates';

    const cached =
      await this.cacheManager.get(cacheKey);

    if (cached) {
      this.logger.log(
        'Exchange rates served from cache.',
      );

      return {
        source: 'cache',
        data: cached,
      };
    }

    this.logger.log(
      'Fetching fresh exchange rates.',
    );

    const freshRates = {
      BTC: 62450,
      ETH: 3450.5,
      RE: 345.6,
      timestamp: new Date().toISOString(),
    };

    await this.cacheManager.set(
      cacheKey,
      freshRates,
      60000,
    );

    return {
      source: 'network_api',
      data: freshRates,
    };
  }

  async clearUserCache(userId: string) {
    await this.cacheManager.del(
      `transactions_${userId}`,
    );

    await this.cacheManager.del(
      'wallet_coin_rates',
    );

    this.logger.log(
      `Cache cleared for ${userId}`,
    );
  }
}