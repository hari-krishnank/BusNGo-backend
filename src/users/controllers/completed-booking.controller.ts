import { Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { CompletedBookingService } from '../services/completed-booking.service';
import { JwtAuthGuard } from 'src/guards/jwtAuthGuard/jwt.guard';
import { CheckUserBlocked } from 'src/utils/decorators/checkBlockStatus/checkUser.decorator';
import { CancellationService } from '../services/cancellation.service';
import { CancelledBookingService } from '../services/cancelled-booking.service';

@UseGuards(JwtAuthGuard)
@Controller('profile')
export class CompletedBookingController {
    constructor(
        private readonly completedBookingService: CompletedBookingService,
        private readonly cancelledBookingService: CancelledBookingService,
        private readonly cancellationService: CancellationService
    ) { }

    @Get()
    @CheckUserBlocked()
    async getAllCompletedBookings(
        @Request() req,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('sort') sort: string = '-completedAt'
    ) {
        const userId = req.user.userId;
        return this.completedBookingService.getAllbookings(userId, page, limit, sort);
    }

    @Get('booking/:bookingId')
    @CheckUserBlocked()
    async getCompletedBookingByBookingId(@Param('bookingId') bookingId: string) {
        return this.completedBookingService.getBookingByBookingId(bookingId);
    }

    @Post('booking/:bookingId/cancel')
    @CheckUserBlocked()
    async cancelBooking(@Param('bookingId') bookingId: string, @Request() req) {
        const userId = req.user.userId;
        return this.cancellationService.cancelBooking(bookingId, userId);
    }

    @Get('cancelledBookings')
    @CheckUserBlocked()
    async getAllCancelledBookings(
        @Request() req,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 5,
        @Query('sort') sort: string = '-cancelledAt'
    ) {
        const userId = req.user.userId;
        return this.cancelledBookingService.getAllbookings(userId, page, limit, sort);
    }
}