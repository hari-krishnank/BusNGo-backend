import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { WalletTransaction } from '../schemas/walletTransaction.schema';

@Injectable()
export class WalletStripeService {
    private stripe: Stripe;

    constructor(
        private configService: ConfigService,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(WalletTransaction.name) private walletTransactionModel: Model<WalletTransaction>
    ) {
        this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
            apiVersion: '2024-06-20'
        });
    }

    async createWalletTopUpSession(userId: string, amount: number) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: 'Wallet Top-up',
                        },
                        unit_amount: amount * 100,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                userId: userId,
                type: 'wallet_top_up'
            },
            mode: 'payment',
            success_url: `${this.configService.get('FRONTEND_URL')}/wallet/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${this.configService.get('FRONTEND_URL')}/wallet`,
        });

        await this.walletTransactionModel.create({
            userId: userId,
            amount: amount,
            type: 'credit',
            description: 'Wallet top-up',
            status: 'pending',
            stripeSessionId: session.id
        });

        return { id: session.id };
    }

    async handleWebhook(signature: string, payload: Buffer) {
        const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
        try {
            const event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
            if (event.type === 'checkout.session.completed') {
                const session = event.data.object as Stripe.Checkout.Session;
                if (session.metadata?.type === 'wallet_top_up') {
                    await this.handleSuccessfulWalletTopUp(session);
                }
            }
        } catch (err) {
            console.error('Error processing webhook:', err);
            throw new Error('Webhook error');
        }
    }

    private async handleSuccessfulWalletTopUp(session: Stripe.Checkout.Session) {
        const userId = session.metadata?.userId;
        const amount = session.amount_total / 100; 
        
        const transaction = await this.walletTransactionModel.findOne({ stripeSessionId: session.id });
        if (!transaction) {
            console.error(`Transaction not found for session ID ${session.id}`);
            return;
        }

        const user = await this.userModel.findById(userId);
        if (!user) {
            console.error(`User not found for ID ${userId}`);
            return;
        }

        user.walletBalance += amount;
        await user.save();

        transaction.status = 'completed';
        await transaction.save();
    }

    async verifyWalletTopUpSession(sessionId: string) {
        const session = await this.stripe.checkout.sessions.retrieve(sessionId);
        if (session.metadata?.type !== 'wallet_top_up') {
            throw new BadRequestException('Invalid session type');
        }
        return { status: session.payment_status };
    }

    async getWalletBalance(userId: string): Promise<number> {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user.walletBalance;
    }

    async getWalletTransactions(userId: string): Promise<WalletTransaction[]> {
        return this.walletTransactionModel.find({ userId }).sort({ createdAt: -1 });
    }

    async addMoneyToWalletWithStripe(userId: string, amount: number, paymentMethodId: string): Promise<User> {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (amount <= 0) {
            throw new BadRequestException('Amount must be positive');
        }

        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: amount * 100, 
                currency: 'inr',
                payment_method: paymentMethodId,
                confirm: true,
                metadata: {
                    userId: userId,
                    type: 'wallet_top_up'
                },
                return_url: `${this.configService.get('FRONTEND_URL')}/wallet/top-up-result`,
                automatic_payment_methods: {
                    enabled: true,
                    allow_redirects: 'never'
                }
            });

            if (paymentIntent.status === 'succeeded') {
                user.walletBalance += amount;
                await user.save();

                await this.walletTransactionModel.create({
                    userId: user._id,
                    amount: amount,
                    type: 'credit',
                    description: 'Stripe wallet top-up',
                    status: 'completed',
                    stripeSessionId: paymentIntent.id
                });

                return user;
            } else if (paymentIntent.status === 'requires_action') {
                throw new BadRequestException('Payment requires additional action', { cause: paymentIntent.client_secret });
            } else {
                throw new BadRequestException('Payment failed');
            }
        } catch (error) {
            console.error('Stripe payment error:', error);
            throw new BadRequestException('Payment processing failed');
        }
    }
}