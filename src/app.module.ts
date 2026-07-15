import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';
import { DriversModule } from './drivers/drivers.module';
import { OrdersModule } from './orders/orders.module';
import { ShiftsModule } from './shifts/shifts.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,

      ttl: 60000,
    }),

    PrismaModule,

    DriversModule,

    OrdersModule,

    ShiftsModule,

    WalletModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}