import { Controller, Post, Body, Get, UseGuards, Req, Param } from '@nestjs/common';
import { WalletStripeService } from '../services/wallet-stripe.service';
import { JwtAuthGuard } from 'src/guards/jwtAuthGuard/jwt.guard';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
    constructor(private readonly walletStripeService: WalletStripeService) { }

    @Post('top-up')
    async createTopUpSession(@Req() req, @Body('amount') amount: number) {
        return this.walletStripeService.createWalletTopUpSession(req.user.userId, amount);
    }

    @Post('add-money-stripe')
    async addMoneyWithStripe(@Req() req, @Body() body: { amount: number, paymentMethodId: string }) {
        return this.walletStripeService.addMoneyToWalletWithStripe(req.user.userId, body.amount, body.paymentMethodId);
    }

    @Get('balance')
    async getWalletBalance(@Req() req) {
        return this.walletStripeService.getWalletBalance(req.user.userId);
    }

    @Get('transactions')
    async getWalletTransactions(@Req() req) {
        return this.walletStripeService.getWalletTransactions(req.user.userId);
    }

    @Get('verify-session/:sessionId')
    async verifyTopUpSession(@Req() req, @Param('sessionId') sessionId: string) {
        return this.walletStripeService.verifyWalletTopUpSession(sessionId);
    }
}