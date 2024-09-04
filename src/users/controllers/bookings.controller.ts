import { Body, Controller, Get, NotFoundException, Param, Post, Request, UseGuards } from '@nestjs/common';
import { PendingBookingService } from '../services/pending-booking.service';
import { CreatePendingBookingDto } from '../dto/CreatePendingBooking.dto';
import { Types } from 'mongoose';
import { JwtAuthGuard } from 'src/guards/jwtAuthGuard/jwt.guard';

@Controller('bookings')
export class BookingsController {
    constructor(private pendingBookingService: PendingBookingService) { }

    @Post('pending-booking')
    @UseGuards(JwtAuthGuard)
    async createPendingBooking(@Request() req, @Body() pendingBookingData: CreatePendingBookingDto) {
        const userId = req.user.userId
        const userObjectId = new Types.ObjectId(userId);
        console.log('user Id kittunnund', userId);
        return this.pendingBookingService.createPendingBooking(
            { ...pendingBookingData, userId: userObjectId },
            userId
        );
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