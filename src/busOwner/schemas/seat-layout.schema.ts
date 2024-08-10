import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class SeatLayout extends Document {
    @Prop({ required: true })
    layoutName: string;

    @Prop({ required: true, enum: ['Left', 'Right'] })
    driverSeatPosition: string;

    @Prop({ required: true })
    rows: number;

    @Prop({ required: true })
    columns: number;

    @Prop({ default: false })
    upperDeck: boolean;

    @Prop({ type: [String], default: [] })
    selectedSeats: string[];

    @Prop({ required: true, enum: ['Active', 'Inactive'], default: 'Active' })
    status: string;

    @Prop({ type: Types.ObjectId, ref: 'verifiedOwner', required: true })
    ownerId: Types.ObjectId;
}

export const SeatLayoutSchema = SchemaFactory.createForClass(SeatLayout);