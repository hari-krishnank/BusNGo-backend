import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CompletedBookingRepository } from '../repositories/completed-booking.repository';
import { UsersService } from './users.service';
import { WalletTransactionService } from './wallet-transaction.service';

@Injectable()
export class CancellationService {
    constructor(
        private completedBookingRepository: CompletedBookingRepository,
        private walletTransactionService: WalletTransactionService,
        private userService: UsersService
    ) { }

    async cancelBooking(bookingId: string, userId: string): Promise<{ message: string; refundAmount: number }> {
        const booking = await this.completedBookingRepository.findByBookingId(bookingId);
        console.log(bookingId);
        console.log(booking)

        if (!booking) {
            throw new NotFoundException(`Booking with ID ${bookingId} not found`);
        }

        if (booking.userId.toString() !== userId) {
            throw new BadRequestException('You are not authorized to cancel this booking');
        }

        const { hoursUntilDeparture, currentRefundPercentage } = this.calculateTimeAndRefund(
            booking.travelDate,
            booking.routeId.schedule.startFrom,
            booking.cancellationPolicy
        );

        if (hoursUntilDeparture <= 0) {
            throw new BadRequestException('This booking can no longer be cancelled');
        }

        const refundAmount = Math.round((booking.totalAmount * currentRefundPercentage) / 100);

        booking.status = 'cancelled';
        await booking.save();

        await this.walletTransactionService.addTransaction(userId, refundAmount, 'credit', 'Booking cancellation refund');

        await this.userService.updateWalletBalance(userId, refundAmount);

        return { message: 'Booking cancelled successfully', refundAmount };
    }

    private calculateTimeAndRefund(travelDate: string, departureTime: string, cancellationPolicy: { hours: number; refundPercentage: number }[]): { hoursUntilDeparture: number, currentRefundPercentage: number } {
        const now = new Date();
        const { hours, minutes } = this.parseTime(departureTime);

        const departureDateObj = new Date(travelDate);
        departureDateObj.setHours(hours, minutes, 0, 0);

        const timeDiff = departureDateObj.getTime() - now.getTime();
        const hoursUntilDeparture = Math.max(0, timeDiff / (1000 * 60 * 60));

        let currentRefundPercentage = 0;
        for (const policy of cancellationPolicy) {
            if (hoursUntilDeparture >= policy.hours) {
                currentRefundPercentage = policy.refundPercentage;
                break;
            }
        }

        return { hoursUntilDeparture, currentRefundPercentage };
    }

    private parseTime(timeString: string): { hours: number, minutes: number } {
        const [time, period] = timeString.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (period.toUpperCase() === 'PM' && hours !== 12) {
            hours += 12;
        } else if (period.toUpperCase() === 'AM' && hours === 12) {
            hours = 0;
        }

        return { hours, minutes };
    }
}