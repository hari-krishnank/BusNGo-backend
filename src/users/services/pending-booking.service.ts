import { Injectable, NotFoundException } from '@nestjs/common';
import { PendingBookingRepository } from '../repositories/pending-booking.repository';
import { PendingBooking } from '../schemas/pendingBookings.schema';
import { Types } from 'mongoose';

@Injectable()
export class PendingBookingService {
    constructor(private pendingBookingRepository: PendingBookingRepository) { }

    async createPendingBooking(pendingBookingData: Partial<PendingBooking>, userId: string): Promise<PendingBooking> {
        const bookingId = this.generateBookingId();
        return this.pendingBookingRepository.create({
            userId: new Types.ObjectId(userId),
            ...pendingBookingData,
            bookingId,
        }); 
    }

    private generateBookingId(): string {
        const prefix = 'BNG';
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        return `${prefix}${randomNum}`;
    }


    async getPendingBookingById(bookingId: string): Promise<PendingBooking> {
        const booking = await this.pendingBookingRepository.findByBookingId(bookingId);
        console.log('booking ind',booking);
        if (booking) {
            console.log('Trip details:', booking.tripId);
        }
        if (!booking) {
            throw new NotFoundException(`Booking with ID ${bookingId} not found`);
        }
        return booking;
    }
}