import { Controller, Post, Body } from '@nestjs/common';
import { SearchTripService } from '../services/search-trip.service';
import { SearchTripDto } from '../dto/searchTrip.dto';
import { Trip } from 'src/busOwner/schemas/trip.schema';

@Controller('search')
export class SearchTripController {
    constructor(private readonly tripService: SearchTripService) { }

    @Post('trip')
    async searchTrips(@Body() searchTripDto: SearchTripDto): Promise<Trip[]> {
        return this.tripService.searchTrips(searchTripDto);
    }
}