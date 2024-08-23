import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PendingBooking } from '../schemas/pendingBookings.schema';

@Injectable()
export class PendingBookingRepository {
    constructor(
        @InjectModel(PendingBooking.name) private pendingBookingModel: Model<PendingBooking>,
    ) { }

    async create(pendingBookingData: Partial<PendingBooking>): Promise<PendingBooking> {
        const createdPendingBooking = new this.pendingBookingModel({
            ...pendingBookingData,
            tripId: this.toObjectId(pendingBookingData.tripId),
            boardingPoint: this.toObjectId(pendingBookingData.boardingPoint),
            droppingPoint: this.toObjectId(pendingBookingData.droppingPoint),
        });
        return createdPendingBooking.save();
    }

    private toObjectId(id: string | Types.ObjectId | undefined): Types.ObjectId | undefined {
        if (id instanceof Types.ObjectId) {
            return id;
        }
        if (typeof id === 'string') {
            return new Types.ObjectId(id);
        }
        return undefined;
    }

    async findByBookingId(bookingId: string): Promise<PendingBooking | null> {
        return this.pendingBookingModel.findOne({ bookingId }).exec();
    }
}