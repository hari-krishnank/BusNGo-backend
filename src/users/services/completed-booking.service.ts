import { Injectable, NotFoundException } from '@nestjs/common';
import { CompletedBooking } from '../schemas/completeBooking.schema';
import { Types } from 'mongoose';
import { CompletedBookingRepository } from '../repositories/completed-booking.repository';
import { PendingBookingService } from './pending-booking.service';

@Injectable()
export class CompletedBookingService {
    constructor(
        private completedBookingRepository: CompletedBookingRepository,
        private pendingBookingService: PendingBookingService
    ) { }

    async getAllbookings(userId: string, page: number, limit: number, sort: string): Promise<{ bookings: CompletedBooking[], count: number, totalPages: number }> {
        const { bookings, count } = await this.completedBookingRepository.findAll(new Types.ObjectId(userId), page, limit, sort);
        const updatedBookings = bookings.map(booking => this.addDynamicFields(booking));
        const totalPages = Math.ceil(count / limit);
        return { bookings: updatedBookings, count, totalPages };
    }

    async getBookingByBookingId(bookingId: string): Promise<CompletedBooking> {
        const booking = await this.completedBookingRepository.findByBookingId(bookingId);
        if (!booking) {
            throw new NotFoundException(`Booking with ID ${bookingId} not found`);
        }
        return this.addDynamicFields(booking);
    }

    private addDynamicFields(booking: CompletedBooking): CompletedBooking {
        const { hoursUntilDeparture, currentRefundPercentage } = this.pendingBookingService.calculateTimeAndRefund(
            booking.travelDate,
            booking.routeId.schedule.startFrom,
            booking.cancellationPolicy
        );

        booking.hoursUntilDeparture = hoursUntilDeparture;
        booking.currentRefundPercentage = currentRefundPercentage;

        return booking;
    }
}