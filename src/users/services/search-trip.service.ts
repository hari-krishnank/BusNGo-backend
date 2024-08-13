import { Injectable } from '@nestjs/common';
import { Trip } from 'src/busOwner/schemas/trip.schema';
import { SearchTripRepository } from '../repositories/search-trip.repository.dto';
import { SearchTripDto } from '../dto/searchTrip.dto';

@Injectable()
export class SearchTripService {
    constructor(private readonly searchTripRepository: SearchTripRepository) {}

    async searchTrips(searchTripDto: SearchTripDto): Promise<Trip[]> {
        return this.searchTripRepository.searchTrips(searchTripDto);
    }
}