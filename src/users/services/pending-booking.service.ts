import { Injectable, NotFoundException } from '@nestjs/common';
import { PendingBookingRepository } from '../repositories/pending-booking.repository';
import { PendingBooking } from '../schemas/pendingBookings.schema';

@Injectable()
export class PendingBookingService {
    constructor(private pendingBookingRepository: PendingBookingRepository) { }

    async createPendingBooking(pendingBookingData: Partial<PendingBooking>): Promise<PendingBooking> {
        const bookingId = this.generateBookingId();
        return this.pendingBookingRepository.create({
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
        if (!booking) {
            throw new NotFoundException(`Booking with ID ${bookingId} not found`);
        }
        return booking;
    }
}