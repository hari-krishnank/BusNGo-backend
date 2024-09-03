import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { CompletedBooking } from '../schemas/completeBooking.schema';
import { Model } from 'mongoose';
import { PendingBooking } from '../schemas/pendingBookings.schema';

@Injectable()
export class StripeService {
    private stripe: Stripe;

    constructor(
        private configService: ConfigService,
        @InjectModel(CompletedBooking.name) private completedBookingModel: Model<CompletedBooking>,
        @InjectModel(PendingBooking.name) private pendingBookingModel: Model<PendingBooking>
    ) {
        this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
            apiVersion: '2024-06-20'
        });
    }

    async createCheckoutSession(amount: number, bookingId: string) {
        console.log('booking Id', bookingId);

        const pendingBooking = await this.pendingBookingModel.findById(bookingId);
        if (!pendingBooking) {
            throw new Error('Pending booking not found');
        }

        const randomBookingId = pendingBooking.bookingId;
        console.log(randomBookingId);


        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: 'Bus Ticket'
                        },
                        unit_amount: amount * 100,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                bookingId: bookingId
            },
            mode: 'payment',
            success_url: `${this.configService.get('FRONTEND_URL')}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${this.configService.get('FRONTEND_URL')}/busTickets/${randomBookingId}`,
        });
        console.log('session ind', session);
        return { id: session.id };
    }

    async completeBooking(bookingId: string) {
        const pendingBooking = await this.pendingBookingModel.findById(bookingId);
        console.log('pending booking found:', pendingBooking);

        if (!pendingBooking) {
            throw new Error('Pending booking not found');
        }

        const completedBooking = new this.completedBookingModel({
            ...pendingBooking.toObject(),
            status: 'completed',
            completedAt: new Date()
        });
        console.log('completed booking created:', completedBooking);

        await completedBooking.save();

        await this.pendingBookingModel.findByIdAndDelete(bookingId);

        return { message: 'Booking completed successfully', completedBooking };
    }
}