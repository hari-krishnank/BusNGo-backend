import { Injectable } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { CompletedBooking } from "../schemas/completeBooking.schema";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class CancelledBookingRepository {
    constructor(@InjectModel(CompletedBooking.name) private completedBookingModel: Model<CompletedBooking>) { }

    async findAll(userId: Types.ObjectId): Promise<{ bookings: CompletedBooking[], count: number }> {
        const [bookings, count] = await Promise.all([
            this.completedBookingModel.find({ userId, status: 'cancelled' })
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
                }).exec(),
            this.completedBookingModel.countDocuments({ userId, status: 'cancelled' })
        ]);
        return { bookings, count };
    }
}   