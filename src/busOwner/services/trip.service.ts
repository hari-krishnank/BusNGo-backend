import { Injectable } from '@nestjs/common';
import { TripRepository } from '../repositories/trip.repository';
import { CreateTripDto } from '../dto/trip.dto';
import { Trip } from '../schemas/trip.schema';

@Injectable()
export class TripService {
    constructor(private tripRepository: TripRepository) { }

    async createTrip(createTripDto: CreateTripDto): Promise<Trip> {
        return this.tripRepository.create(createTripDto);
    }

    async getAllTrips(): Promise<Trip[]> {
        return this.tripRepository.findAll();
    }
}