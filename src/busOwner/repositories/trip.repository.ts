import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Trip } from '../schemas/trip.schema';
import { CreateTripDto } from '../dto/trip.dto';

@Injectable()
export class TripRepository {
    constructor(@InjectModel(Trip.name) private tripModel: Model<Trip>) { }

    async create(createTripDto: CreateTripDto & { ownerId: Types.ObjectId }): Promise<Trip> {
        const createdTrip = new this.tripModel(createTripDto);
        return createdTrip.save();
    }

    async findAll(ownerId: Types.ObjectId, skip: number, limit: number): Promise<{ trips: Trip[], total: number }> {
        const [trips, total] = await Promise.all([
            this.tripModel.find({ ownerId }).skip(skip).limit(limit).populate('fleetType').populate('route').populate('startFrom').populate('endTo').exec(),
            this.tripModel.countDocuments({ ownerId })
        ])
        return { trips, total }
    }

    // async findById(id: string): Promise<Trip | null> {
    //     return this.tripModel.findById(id).exec();
    // }

    async findById(id: string): Promise<Trip | null> {
        return this.tripModel.findById(id).populate({
            path: 'route',
            populate: { path: 'schedule', model: 'Schedule' }
        }).exec();
    }
}