import { Injectable } from '@nestjs/common';
import { TripRepository } from '../repositories/trip.repository';
import { CreateTripDto } from '../dto/trip.dto';
import { Trip } from '../schemas/trip.schema';
import { Types } from 'mongoose';

@Injectable()
export class TripService {
    constructor(private tripRepository: TripRepository) { }

    async createTrip(createTripDto: CreateTripDto, ownerId: string): Promise<Trip> {
        const tripWithOwner = {
            ...createTripDto,
            ownerId: new Types.ObjectId(ownerId)
        }
        return this.tripRepository.create(tripWithOwner);
    }

    async getAllTrips(ownerId: string, page: number, limit: number): Promise<{ trips: Trip[], total: number }> {
        const skip = (page - 1) * limit;
        return this.tripRepository.findAll(new Types.ObjectId(ownerId), skip, limit);
    }
}