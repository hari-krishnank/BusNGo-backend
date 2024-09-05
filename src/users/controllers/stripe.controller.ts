import { Controller, Post, Body, Param, Get, Headers, UseGuards } from '@nestjs/common';
import { StripeService } from '../services/stripe.service';
import { RawBody } from 'src/utils/raw-body.decorator';
import { CompletedBookingService } from '../services/completed-booking.service';
import { JwtAuthGuard } from 'src/guards/jwtAuthGuard/jwt.guard';

@Controller('payments')
export class StripeController {

    constructor(private readonly stripeService: StripeService, private completedBookingService: CompletedBookingService) { }

    @Post('create-checkout-session')
    async createCheckoutSession(@Body() bookingDetails: any) {
        console.log('Received request body:', bookingDetails);
        return this.stripeService.createCheckoutSession(bookingDetails);
    }

    @Get('verify-session/:sessionId')
    async verifySession(@Param('sessionId') sessionId: string) {
        return this.stripeService.verifySession(sessionId);
    }

    @Post('webhook')
    async handleWebhook(
        @Headers('stripe-signature') signature: string,
        @RawBody() rawBody: Buffer
    ) {
        if (!rawBody) {
            console.error('Raw body not available');
            throw new Error('No raw body available');
        }
        return this.stripeService.handleWebhook(signature, rawBody);
    }

    @Get('completed-booking/:bookingId')
    async getCompletedBooking(@Param('bookingId') bookingId: string) {
        return this.stripeService.getCompletedBooking(bookingId);
    }
}