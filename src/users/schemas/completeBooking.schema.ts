import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class CompletedBooking extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ required: true, unique: true })
    bookingId: string;

    @Prop({ type: Types.ObjectId, required: true, ref: 'Trip' })
    tripId: Types.ObjectId | string;

    @Prop({ type: Types.ObjectId, required: true, ref: 'Bus' })
    busId: Types.ObjectId | string;

    @Prop({ type: Types.ObjectId, required: true, ref: 'Route' })
    routeId: Types.ObjectId | string;

    @Prop({ required: true })
    selectedSeatNumbers: any[]

    @Prop({ required: true })
    selectedSeats: any[];

    @Prop({ type: Types.ObjectId, required: true, ref: 'Counter' })
    boardingPoint: Types.ObjectId | string;

    @Prop({ type: Types.ObjectId, required: true, ref: 'Counter' })
    droppingPoint: Types.ObjectId | string;

    @Prop({ type: [{ type: Object }], required: true })
    travellersDetails: any[];

    @Prop({ required: true })
    totalTicketPrice: number;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ default: 'completed' })
    status: string;

    @Prop({ default: Date.now })
    completedAt: Date;
}

export const CompletedBookingSchema = SchemaFactory.createForClass(CompletedBooking);