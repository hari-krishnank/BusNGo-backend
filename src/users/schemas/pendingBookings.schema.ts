import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class PendingBooking extends Document {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true, unique: true })
    bookingId: string;

    @Prop({ type: Types.ObjectId, required: true, ref: 'Trip' })
    tripId: Types.ObjectId | string;

    @Prop({ type: Object, required: true })
    tripDetails: any;  

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
}

export const PendingBookingSchema = SchemaFactory.createForClass(PendingBooking);