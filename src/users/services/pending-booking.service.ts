import { Injectable, NotFoundException } from '@nestjs/common';
import { PendingBookingRepository } from '../repositories/pending-booking.repository';
import { PendingBooking } from '../schemas/pendingBookings.schema';
import { Types } from 'mongoose';
import { TripRepository } from 'src/busOwner/repositories/trip.repository';
import { PriceBreakdown } from '../interfaces/booking.interface';

@Injectable()
export class PendingBookingService {
    constructor(private pendingBookingRepository: PendingBookingRepository, private tripRepository: TripRepository) { }

    async createPendingBooking(pendingBookingData: Partial<PendingBooking>, userId: string): Promise<PendingBooking> {
        const bookingId = this.generateBookingId();

        const trip = await this.tripRepository.findById(pendingBookingData.tripId.toString());

        if (!trip) {
            throw new NotFoundException(`Trip with ID ${pendingBookingData.tripId} not found`);
        }

        const baseFare = pendingBookingData.selectedSeats.length * trip.ticketPrice;
        const priceBreakdown = this.calculatePriceBreakdown(baseFare);

        const cancellationPolicy = this.generateCancellationPolicy(trip);
        const lastCancellationDate = this.calculateLastCancellationDate(pendingBookingData.travelDate, cancellationPolicy);

        const { hoursUntilDeparture, currentRefundPercentage } = this.calculateTimeAndRefund(
            pendingBookingData.travelDate,
            trip.route.schedule.startFrom,
            this.generateCancellationPolicy(trip)
        );

        return this.pendingBookingRepository.create({
            userId: new Types.ObjectId(userId),
            bookingId,
            ...pendingBookingData,
            baseFare: priceBreakdown.baseFare,
            tax: priceBreakdown.tax,
            convenienceFee: priceBreakdown.convenienceFee,
            totalAmount: priceBreakdown.totalAmount,
            cancellationPolicy,
            lastCancellationDate,
            hoursUntilDeparture,
            currentRefundPercentage,
        });
    }

    private generateBookingId(): string {
        const prefix = 'BNG';
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        return `${prefix}${randomNum}`;
    }

    private calculatePriceBreakdown(baseFare: number): PriceBreakdown {
        const tax = Math.round(baseFare * 0.05);
        const convenienceFee = this.calculateConvenienceFee(baseFare);
        const totalAmount = baseFare + tax + convenienceFee;
        return { baseFare, tax, convenienceFee, totalAmount };
    }

    private calculateConvenienceFee(baseFare: number): number {
        let fee = 20;
        fee += baseFare * 0.02;
        fee = Math.min(fee, 150);
        fee = Math.max(fee, 30);
        return Math.round(fee);
    }

    private generateCancellationPolicy(trip: any): { hours: number; refundPercentage: number }[] {
        return [
            { hours: 72, refundPercentage: 100 },
            { hours: 48, refundPercentage: 75 },
            { hours: 24, refundPercentage: 50 },
            { hours: 12, refundPercentage: 25 },
            { hours: 6, refundPercentage: 10 },
            { hours: 0, refundPercentage: 0 }
        ];
    }

    private calculateLastCancellationDate(travelDate: string, cancellationPolicy: { hours: number; refundPercentage: number }[]): Date {
        const travelDateObj = new Date(travelDate);
        const lastCancellationHours = Math.min(...cancellationPolicy.map(policy => policy.hours));
        return new Date(travelDateObj.getTime() - lastCancellationHours * 60 * 60 * 1000);
    }

    async getTripDetails(tripId: string) {
        const trip = await this.tripRepository.findById(tripId);
        if (!trip) {
            throw new NotFoundException(`Trip with ID ${tripId} not found`);
        }
        return trip;
    }

    public calculateTimeAndRefund(travelDate: string, departureTime: string, cancellationPolicy: { hours: number; refundPercentage: number }[]): { hoursUntilDeparture: number, currentRefundPercentage: number } {
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

    async getPendingBookingById(bookingId: string): Promise<PendingBooking> {
        const booking = await this.pendingBookingRepository.findByBookingId(bookingId);
        if (!booking) {
            throw new NotFoundException(`Booking with ID ${bookingId} not found`);
        }
        const { hoursUntilDeparture, currentRefundPercentage } = this.calculateTimeAndRefund(
            booking.travelDate,
            booking.routeId.schedule.startFrom,
            booking.cancellationPolicy
        );

        booking.hoursUntilDeparture = hoursUntilDeparture;
        booking.currentRefundPercentage = currentRefundPercentage;

        return booking;
    }
}