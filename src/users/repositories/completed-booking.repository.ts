import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CompletedBooking } from "../schemas/completeBooking.schema";
import { Model, Types } from "mongoose";

@Injectable()
export class CompletedBookingRepository {
    constructor(@InjectModel(CompletedBooking.name) private completedBookingModel: Model<CompletedBooking>) { }

    async findAll(userId: Types.ObjectId, page: number, limit: number, sort: string): Promise<{ bookings: CompletedBooking[], count: number }> {
        const skip = (page - 1) * limit;
        const [bookings, count] = await Promise.all([
            this.completedBookingModel.find({ userId, status: 'completed' })
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
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .exec(),
            this.completedBookingModel.countDocuments({
                userId,
                status: 'completed'
            })
        ]);
        return { bookings, count };
    }

    async findByBookingId(bookingId: string): Promise<CompletedBooking | null> {
        return this.completedBookingModel.findOne({ bookingId })
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
            }).exec();
    }
}