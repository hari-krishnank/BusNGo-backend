import { Controller, Post, Body, Get, Request, UseGuards } from '@nestjs/common';
import { CreateTripDto } from '../dto/trip.dto';
import { Trip } from '../schemas/trip.schema';
import { TripService } from '../services/trip.service';
import { OwnerJwtAuthGuard } from 'src/guards/jwtAuthGuard/ownerJwt.guard';

@Controller('trips')
@UseGuards(OwnerJwtAuthGuard)
export class TripController {
    constructor(private tripService: TripService) { }

    @Post()
    async createTrip(@Request() req, @Body() createTripDto: CreateTripDto): Promise<Trip> {
        const ownerId = req.user.ownerId
        return this.tripService.createTrip(createTripDto, ownerId);
    }

    @Get()
    async getAllTrips(@Request() req): Promise<Trip[]> {
        const ownerId = req.user.ownerId
        return this.tripService.getAllTrips(ownerId);
    }
}