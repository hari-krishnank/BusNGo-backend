import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { CompletedBookingService } from '../services/completed-booking.service';
import { JwtAuthGuard } from 'src/guards/jwtAuthGuard/jwt.guard';
import { CheckUserBlocked } from 'src/utils/checkUser.decorator';

@UseGuards(JwtAuthGuard)
@Controller('profile')
export class CompletedBookingController {
    constructor(private readonly completedBookingService: CompletedBookingService) { }
    
    @Get()
    @CheckUserBlocked()
    async getAllCompletedBookings(
        @Request() req
    ) {
        const userId = req.user.userId;
        return this.completedBookingService.getAllbookings(userId);
    }
}