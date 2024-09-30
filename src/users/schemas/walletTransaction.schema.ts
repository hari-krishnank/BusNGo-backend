import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class WalletTransaction extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true, enum: ['credit', 'debit'] })
    type: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true, enum: ['pending', 'completed', 'failed'] })
    status: string;

    @Prop()
    stripeSessionId: string;
}

export const WalletTransactionSchema = SchemaFactory.createForClass(WalletTransaction);