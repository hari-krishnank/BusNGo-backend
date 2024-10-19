import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { CompletedBooking } from '../schemas/completeBooking.schema';
import { Model } from 'mongoose';
import { PendingBooking } from '../schemas/pendingBookings.schema';
import { User } from '../schemas/user.schema';
import { WalletTransaction } from '../schemas/walletTransaction.schema';
import * as nodemailer from 'nodemailer';
import { PendingBookingService } from './pending-booking.service';
import { Route } from 'src/busOwner/interfaces/route.interface';

@Injectable()
export class StripeService {
    private stripe: Stripe;
    private transporter: nodemailer.Transporter;

    constructor(
        private configService: ConfigService,
        private pendingBookingService: PendingBookingService,
        @InjectModel(CompletedBooking.name) private completedBookingModel: Model<CompletedBooking>,
        @InjectModel(PendingBooking.name) private pendingBookingModel: Model<PendingBooking>,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(WalletTransaction.name) private walletTransactionModel: Model<WalletTransaction>
    ) {
        this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
            apiVersion: '2024-06-20'
        });

        const emailUser = this.configService.get<string>('email.user');
        const emailPass = this.configService.get<string>('email.pass');

        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: true,
            auth: {
                user: emailUser,
                pass: emailPass,
            },
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

                const bookinggId = session.metadata.bookingId

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
            const tripDetails = await this.pendingBookingService.getTripDetails(pendingBooking.tripId);

            const { currentRefundPercentage, hoursUntilDeparture } =
                this.pendingBookingService.calculateTimeAndRefund(
                    pendingBooking.travelDate,
                    tripDetails.route.schedule.startFrom,
                    pendingBooking.cancellationPolicy
                );

            // const completedBooking = new this.completedBookingModel(pendingBooking.toObject());
            // console.log(completedBooking);

            // completedBooking.status = 'completed';
            // completedBooking.completedAt = new Date();
            const completedBooking = new this.completedBookingModel({
                ...pendingBooking.toObject(),
                status: 'completed',
                completedAt: new Date(),
                departureTime: tripDetails.route.schedule.startFrom,
                currentRefundPercentage,
                hoursUntilDeparture
            });
            console.log(completedBooking);


            await completedBooking.save();
            await this.pendingBookingModel.findByIdAndDelete(pendingBooking._id);

            await this.sendTicketEmail(completedBooking);
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

        if (!completedBooking) {
            throw new NotFoundException('Completed booking not found');
        }

        const route = completedBooking.routeId as Route;

        const { hoursUntilDeparture, currentRefundPercentage } = this.pendingBookingService.calculateTimeAndRefund(
          completedBooking.travelDate,
          route.schedule.startFrom,
          completedBooking.cancellationPolicy
        );
      
        // Update the completed booking with the new values
        completedBooking.hoursUntilDeparture = hoursUntilDeparture;
        console.log(completedBooking.hoursUntilDeparture);
        
        completedBooking.currentRefundPercentage = currentRefundPercentage;

        return completedBooking;
    }

    private async sendTicketEmail(booking: CompletedBooking): Promise<void> {
        const mailOptions = {
            from: this.configService.get<string>('email.user'),
            to: booking.email,
            subject: 'Your Bus Ticket Confirmation',
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f7f9; border-radius: 10px;">
                <h1 style="color: #333; text-align: center; margin-bottom: 30px;">Your Bus Ticket Confirmation</h1>
                <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <h2 style="color: #4a90e2;">Booking Details:</h2>
                    <p><strong>Booking ID:</strong> ${booking._id}</p>
                </div>
                <p style="font-size: 14px; color: #666; text-align: center; margin-top: 30px;">
                    Thank you for choosing our service. Have a safe journey!
                </p>
            </div>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Ticket sent to ${booking.email}`);
        } catch (error) {
            console.error('Error sending ticket email:', error);
        }
    }
}