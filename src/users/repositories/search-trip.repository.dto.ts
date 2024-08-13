import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trip } from 'src/busOwner/schemas/trip.schema';
import { AssignedBus } from 'src/busOwner/schemas/assigned-bus.schema';
import { SearchTripDto } from '../dto/searchTrip.dto';

@Injectable()
export class SearchTripRepository {
    private readonly logger = new Logger(SearchTripRepository.name);

    constructor(
        @InjectModel(Trip.name) private tripModel: Model<Trip>,
        @InjectModel(AssignedBus.name) private assignedBusModel: Model<AssignedBus>,
    ) { }
    
    async searchTrips(searchTripDto: SearchTripDto): Promise<any[]> {
        const { from, to, date } = searchTripDto;
        const searchDate = new Date(date);
        const dayOfWeek = searchDate.toLocaleString('en-us', { weekday: 'long' });
        this.logger.log(`Search parameters: ${JSON.stringify({ from, to, dayOfWeek, status: 'Active' })}`);

        const matchingTrips = await this.tripModel.find({
            status: 'Active',
            dayOff: { $ne: dayOfWeek }
        })
            .populate({
                path: 'startFrom',
                match: { location: { $regex: new RegExp(from, 'i') } }
            })
            .populate({
                path: 'endTo',
                match: { location: { $regex: new RegExp(to, 'i') } }
            })
            .populate('fleetType')
            .populate('route')
            .populate('schedule')
            .exec();
        const filteredTrips = matchingTrips.filter(trip => trip.startFrom && trip.endTo);

        this.logger.log(`Matching trips: ${filteredTrips.length}`);

        if (filteredTrips.length === 0) {
            const allTrips = await this.tripModel.find().exec();
            this.logger.log(`All trips in database: ${JSON.stringify(allTrips)}`);
            return [];
        }

        const tripIds = filteredTrips.map(trip => trip._id);
        const assignedBuses = await this.assignedBusModel.find({
            trip: { $in: tripIds },
            status: 'Active'
        }).populate('bus').exec();

        this.logger.log(`Assigned buses: ${assignedBuses.length}`);

        const result = filteredTrips.map(trip => {
            const assignedBus = assignedBuses.find(ab => ab.trip.toString() === trip._id.toString());
            return {
                ...trip.toObject(),
                bus: assignedBus ? assignedBus.bus : null
            };
        });

        this.logger.log(`Final result: ${result.length}`);
        return result;
    }
}