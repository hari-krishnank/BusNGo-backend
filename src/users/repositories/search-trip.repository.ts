import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trip } from 'src/busOwner/schemas/trip.schema';
import { AssignedBus } from 'src/busOwner/schemas/assigned-bus.schema';
import { SearchTripDto } from '../dto/searchTrip.dto';
import { Amenity } from 'src/busOwner/schemas/amenity.schema';
import { SeatLayout } from 'src/busOwner/schemas/seat-layout.schema';
import { Counter } from 'src/busOwner/schemas/counter.schema';
import { Schedule } from 'src/busOwner/schemas/schedule.schema';
import { formatTripResult } from 'src/utils/searchTripFormatter';
import { CompletedBooking } from '../schemas/completeBooking.schema';

@Injectable()
export class SearchTripRepository {
    private readonly logger = new Logger(SearchTripRepository.name);

    constructor(
        @InjectModel(Trip.name) private tripModel: Model<Trip>,
        @InjectModel(AssignedBus.name) private assignedBusModel: Model<AssignedBus>,
        @InjectModel(Amenity.name) private amenityModel: Model<Amenity>,
        @InjectModel(SeatLayout.name) private seatLayoutModel: Model<SeatLayout>,
        @InjectModel(Counter.name) private stopModel: Model<Counter>,
        @InjectModel(Schedule.name) private scheduleModel: Model<Schedule>,
        @InjectModel(CompletedBooking.name) private completedBookingModel: Model<CompletedBooking>
    ) { }

    async searchTrips(searchTripDto: SearchTripDto): Promise<any[]> {
        const { from, to, date } = searchTripDto;
        const searchDate = new Date(date);
        const dayOfWeek = searchDate.toLocaleString('en-us', { weekday: 'long' });
        const currentTime = new Date();
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
            .populate({
                path: 'fleetType',
                populate: [
                    {
                        path: 'facilities',
                        model: 'Amenity'
                    },
                    {
                        path: 'seatLayout',
                        model: 'SeatLayout'
                    }
                ]
            })
            .populate({
                path: 'route',
                populate: [
                    {
                        path: 'additionalStops.stop',
                        model: 'Counter'
                    },
                    {
                        path: 'schedule',
                        model: 'Schedule'
                    }
                ]
            }).exec();

        const filteredTrips = matchingTrips.filter(trip => {
            if (!trip.startFrom || !trip.endTo) {
                this.logger.log(`Trip ${trip._id} filtered out due to missing startFrom or endTo`);
                return false;
            }

            const departureTime = new Date(searchDate);
            const [hours, minutes] = trip.route.schedule.startFrom.split(':');
            departureTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

            if (departureTime <= currentTime) {
                this.logger.log(`Trip ${trip._id} filtered out due to passed departure time: ${departureTime}`);
                return false;
            }

            return departureTime > currentTime;
        });

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

        const bookedSeatsAggregation = await this.completedBookingModel.aggregate([
            {
                $match: {
                    tripId: { $in: tripIds },
                    travelDate: date
                }
            },
            {
                $group: {
                    _id: { tripId: '$tripId', busId: '$busId' },
                    bookedSeats: { $push: '$selectedSeats' }
                }
            },
            {
                $project: {
                    _id: 0,
                    tripId: '$_id.tripId',
                    busId: '$_id.busId',
                    bookedSeats: {
                        $reduce: {
                            input: '$bookedSeats',
                            initialValue: [],
                            in: { $setUnion: ['$$value', '$$this'] }
                        }
                    }
                }
            }
        ]);

        const bookedSeatsMap = new Map();
        bookedSeatsAggregation.forEach(item => {
            const key = `${item.tripId.toString()}-${item.busId.toString()}`;
            bookedSeatsMap.set(key, item.bookedSeats.flat());
        });

        this.logger.log(bookedSeatsAggregation)

        const result = [];
        for (const trip of filteredTrips) {
            const tripAssignedBuses = assignedBuses.filter(ab => ab.trip.toString() === trip._id.toString());

            this.logger.log(`Trip ${trip._id}: ${tripAssignedBuses.length} assigned buses`);

            for (const assignedBus of tripAssignedBuses) {
                const key = `${trip._id.toString()}-${assignedBus.bus._id.toString()}`;
                const busBookedSeats = bookedSeatsMap.get(key) || [];

                this.logger.log(`Bus ${assignedBus.bus._id}: ${busBookedSeats.length}, ${busBookedSeats} booked seats`);

                result.push(formatTripResult(trip, assignedBus.bus, busBookedSeats));
            }
        }

        this.logger.log(`Final result: ${result.length}`);
        return result;
    }
}