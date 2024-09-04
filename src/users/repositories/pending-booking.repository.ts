import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PendingBooking } from '../schemas/pendingBookings.schema';

@Injectable()
export class PendingBookingRepository {
    constructor(
        @InjectModel(PendingBooking.name) private pendingBookingModel: Model<PendingBooking>
    ) { }

    async create(pendingBookingData: Partial<PendingBooking> & { userId: Types.ObjectId }): Promise<PendingBooking> {
        const createdPendingBooking = new this.pendingBookingModel({
            ...pendingBookingData,
            tripId: this.toObjectId(pendingBookingData.tripId),
            busId: this.toObjectId(pendingBookingData.busId),
            routeId: this.toObjectId(pendingBookingData.routeId),
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
        console.log(bookingId);

        return this.pendingBookingModel
            .findOne({ bookingId })
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
    }
}