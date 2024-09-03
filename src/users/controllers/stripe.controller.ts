import { Controller, Post, Body, Req, Param, Get } from '@nestjs/common';
import { StripeService } from '../services/stripe.service';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Controller('payments')
export class StripeController {
    private stripe: Stripe;
    constructor(private readonly stripeService: StripeService, private configService: ConfigService) { }

    @Post('create-checkout-session')
    async createCheckoutSession(@Body() body: { amount: number, bookingId: string }) {
        console.log('Received request body:', body);
        return this.stripeService.createCheckoutSession(body.amount, body.bookingId);
    }

    @Post('webhook')
    async handleStripeWebhook(@Req() request, @Body() payload: any) {
        const sig = request.headers['stripe-signature'];
        let event;

        try {
            event = this.stripe.webhooks.constructEvent(
                payload,
                sig,
                this.configService.get('STRIPE_WEBHOOK_SECRET')
            );
        } catch (err) {
            console.error(err);
            throw new Error(`Webhook Error: ${err.message}`);
        }

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                const bookingId = session.metadata.bookingId;
                await this.stripeService.completeBooking(bookingId);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
        return { received: true };
    }

    @Get('verify-session/:sessionId')
    async verifySession(@Param('sessionId') sessionId: string) {
        const session = await this.stripe.checkout.sessions.retrieve(sessionId);
        console.log(session);
        return { status: session.payment_status };
    }
}