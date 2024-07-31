import { Controller, Post, Body, Get } from '@nestjs/common';
import { CreateTripDto } from '../dto/trip.dto';
import { Trip } from '../schemas/trip.schema';
import { TripService } from '../services/trip.service';

@Controller('trips')
export class TripController {
    constructor(private tripService: TripService) { }

    @Post()
    async createTrip(@Body() createTripDto: CreateTripDto): Promise<Trip> {
        return this.tripService.createTrip(createTripDto);
    }

    @Get()
    async getAllTrips(): Promise<Trip[]> {
        return this.tripService.getAllTrips();
    }
}