import { Injectable } from '@nestjs/common';
import { CompletedBooking } from '../schemas/completeBooking.schema';
import { Types } from 'mongoose';
import { CompletedBookingRepository } from '../repositories/completed-booking.repository';

@Injectable()
export class CompletedBookingService {
    constructor(private completedBookingRepository: CompletedBookingRepository ) { }
    async getAllbookings(userId: string ): Promise<{ bookings: CompletedBooking[] }> {
        return this.completedBookingRepository.findAll(new Types.ObjectId(userId));
    }
}
