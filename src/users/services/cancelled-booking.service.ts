import { Injectable, NotFoundException } from '@nestjs/common';
import { CancelledBookingRepository } from '../repositories/cancelled-booking.repository';
import { CompletedBooking } from '../schemas/completeBooking.schema';
import { Types } from 'mongoose';

@Injectable()
export class CancelledBookingService {
    constructor(
        private cancelledBookingRepository: CancelledBookingRepository,
    ) { }

    async getAllbookings(userId: string, page: number, limit: number, sort: string): Promise<{ bookings: CompletedBooking[], count: number }> {
        const { bookings, count } = await this.cancelledBookingRepository.findAll(new Types.ObjectId(userId), page, limit, sort);
        return { bookings, count };
    }
}