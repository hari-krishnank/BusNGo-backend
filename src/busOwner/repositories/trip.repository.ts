import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trip } from '../schemas/trip.schema';
import { CreateTripDto } from '../dto/trip.dto';

@Injectable()
export class TripRepository {
    constructor(@InjectModel(Trip.name) private tripModel: Model<Trip>) { }

    async create(createTripDto: CreateTripDto): Promise<Trip> {
        const createdTrip = new this.tripModel(createTripDto);
        return createdTrip.save();
    }

    async findAll(): Promise<Trip[]> {
        return this.tripModel.find()
            .populate('fleetType')
            .populate('route')
            .populate('schedule')
            .populate('startFrom')
            .populate('endTo')
            .exec();
    }
}