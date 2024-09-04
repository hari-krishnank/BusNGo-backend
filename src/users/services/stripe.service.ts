import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

    async createCheckoutSession(bookingDetails: any) {
        const pendingBooking = await this.pendingBookingModel.findById(bookingDetails.bookingId);
        if (!pendingBooking) {
            throw new BadRequestException('Pending booking not found');
        }

        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: 'Bus Ticket',
                            description: `From: ${bookingDetails.tripDetails.from} To: ${bookingDetails.tripDetails.to}`
                        },
                        unit_amount: bookingDetails.amount * 100,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                bookingId: bookingDetails.bookingId,
                tripDetails: JSON.stringify(bookingDetails.tripDetails),
                travellers: bookingDetails.travellers
            },
            mode: 'payment',
            success_url: `${this.configService.get('FRONTEND_URL')}/booking-success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingDetails.bookingId}`,
            cancel_url: `${this.configService.get('FRONTEND_URL')}/busTickets/${pendingBooking.bookingId}`,
        });
        return { id: session.id };
    }

    async verifySession(sessionId: string) {
        const session = await this.stripe.checkout.sessions.retrieve(sessionId);
        return { status: session.payment_status };
    }

    async handleWebhook(signature: string, payload: Buffer) {
        const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
        try {
            const event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
            if (event.type === 'checkout.session.completed') {
                const session = event.data.object as Stripe.Checkout.Session;
                console.log('dasdadsfadsfadsfadsf',session);
                
                const bookinggId = session.metadata.bookingId
                console.log('vfdsfsafasfasfsa0',bookinggId);
                
                await this.handleSuccessfulPayment(session, bookinggId);
            }
        } catch (err) {
            console.error('Error processing webhook:', err);
            throw new Error('Webhook error');
        }
    }

    private async handleSuccessfulPayment(session: Stripe.Checkout.Session, bookinggId: string) {
        const bookingId = session.metadata?.bookingId;
        if (!bookingId) {
            console.error('Booking ID not found in session metadata');
            return;
        }
        const pendingBooking = await this.pendingBookingModel.findById(bookinggId);
        try {
            if (!pendingBooking) {
                console.error(`Pending booking not found for ID ${bookingId}`);
                return;
            }
            const completedBooking = new this.completedBookingModel(pendingBooking.toObject());
            completedBooking.status = 'completed';
            completedBooking.completedAt = new Date();

            await completedBooking.save();
            await this.pendingBookingModel.findByIdAndDelete(pendingBooking._id);
        } catch (error) {
            console.error(`Error processing payment for booking ID ${bookingId}:`, error);
        }
    }

    async getCompletedBooking(bookingId: string) {
        console.log('Attempting to fetch completed booking with ID:', bookingId);
        const completedBooking = await this.completedBookingModel.findById(bookingId)
            .populate({
                path: 'tripId',
                select: ['_id', 'title', 'fleetType', 'ticketPrice'],
                populate: [
                    {
                        path: 'fleetType',
                        select: ['_id', 'name']
                    },
                    {
                        path: 'startFrom',
                        select: ['_id', 'name', 'city', 'location']
                    },
                    {
                        path: 'endTo',
                        select: ['_id', 'name', 'city', 'location']
                    }
                ]
            })
            .populate({
                path: 'busId',
                select: ['_id', 'name']
            })
            .populate({
                path: 'routeId',
                select: ['_id', 'name', 'schedule', 'additionalStops', 'distance', 'time'],
                populate: [
                    {
                        path: 'schedule',
                        select: ['_id', 'startFrom', 'end', 'duration']
                    }
                ]
            })
            .populate({
                path: 'boardingPoint',
                select: ['_id', 'name', 'city', 'location']
            })
            .populate({
                path: 'droppingPoint',
                select: ['_id', 'name', 'city', 'location']
            })
            .exec();

        console.log(completedBooking);

        if (!completedBooking) {
            throw new NotFoundException('Completed booking not found');
        }
        return completedBooking;
    }
}