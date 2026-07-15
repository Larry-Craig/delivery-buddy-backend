import {
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';

import { WalletService } from './wallet.service';
import { WithdrawDto } from './dto/wallet.dto';

import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Wallet & Caching')
@Controller('wallet')
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
  ) {}

  @Post('withdraw')
  @ApiOperation({
    summary: 'Withdraw funds from a driver wallet',
    description:
      'Deducts funds from the driver wallet and records a transaction.',
  })
  @ApiResponse({
    status: 201,
    description: 'Withdrawal successful.',
  })
  @ApiBadRequestResponse({
    description: 'Insufficient wallet balance.',
  })
  @ApiNotFoundResponse({
    description: 'Driver not found.',
  })
  async withdrawFunds(
    @Body() dto: WithdrawDto,
  ) {
    return this.walletService.withdrawFunds(
      dto.userId,
      dto.amount,
    );
  }

  @Get('transactions')
  @ApiOperation({
    summary: 'Retrieve wallet transaction history',
  })
  @ApiQuery({
    name: 'userId',
    example: 'driver-uuid',
  })
  @ApiOkResponse({
    description: 'Transaction history returned.',
  })
  async getTransactions(
    @Query('userId') userId: string,
  ) {
    return this.walletService.getTransactions(userId);
  }

  @Get('rates')
  @ApiOperation({
    summary:
      'Retrieve cached exchange rates (Task 3 Demonstration)',
  })
  @ApiOkResponse({
    description:
      'Returns cached exchange rates or fetches fresh ones.',
  })
  async getRates() {
    return this.walletService.getRates();
  }
}