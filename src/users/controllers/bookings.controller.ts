import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { PendingBookingService } from '../services/pending-booking.service';
import { CreatePendingBookingDto } from '../dto/CreatePendingBooking.dto';

@Controller('bookings')
export class BookingsController {
    constructor(private pendingBookingService: PendingBookingService) { }

    @Post('pending-booking')
    async createPendingBooking(@Body() pendingBookingData: CreatePendingBookingDto) {
        return this.pendingBookingService.createPendingBooking(pendingBookingData);
    }

    @Get('pending-booking/:id')
    async getPendingBooking(@Param('id') bookingId: string) {
        try {
            return await this.pendingBookingService.getPendingBookingById(bookingId);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw error;
        }
    }
}