import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
}

export const SeatLayoutSchema = SchemaFactory.createForClass(SeatLayout);