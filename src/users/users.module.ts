import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/user.schema";
import { UsersController } from "./controllers/users.controller";
import { UsersRepository } from "./repositories/users.repository";
import { UsersService } from "./services/users.service";
import { OtpService } from './services/otp.service';
import { Otp, OtpSchema } from "./schemas/otp.schema";
import { OtpRepository } from "./repositories/otp.repository";
import { UnVerifiedUser, UnVerifiedUserSchema } from "./schemas/unverified-user.schema";
import { OwnerModule } from "src/busOwner/owner.module";
import { Trip, TripSchema } from "src/busOwner/schemas/trip.schema";
import { SearchTripController } from "./controllers/search-trip.controller";
import { SearchTripService } from "./services/search-trip.service";
import { SearchTripRepository } from "./repositories/search-trip.repository";
import { AssignedBus, AssignedBusSchema } from "src/busOwner/schemas/assigned-bus.schema";
import { Amenity, AmenitySchema } from "src/busOwner/schemas/amenity.schema";
import { SeatLayout, SeatLayoutSchema } from "src/busOwner/schemas/seat-layout.schema";
import { Counter, counterSchema } from "src/busOwner/schemas/counter.schema";
import { Schedule, ScheduleSchema } from "src/busOwner/schemas/schedule.schema";
import { PendingBooking, PendingBookingSchema } from "./schemas/pendingBookings.schema";
import { PendingBookingRepository } from "./repositories/pending-booking.repository";
import { PendingBookingService } from "./services/pending-booking.service";
import { BookingsController } from "./controllers/bookings.controller";
import { StripeController } from "./controllers/stripe.controller";
import { StripeService } from "./services/stripe.service";
import { CompletedBooking, CompletedBookingSchema } from "./schemas/completeBooking.schema";
import { CompletedBookingService } from "./services/completed-booking.service";
import { CompletedBookingController } from "./controllers/completed-booking.controller";
import { CompletedBookingRepository } from "./repositories/completed-booking.repository";
import { UserBlockedGuard } from "src/guards/blockcheckGuard/userBlocked.guard";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([{ name: UnVerifiedUser.name, schema: UnVerifiedUserSchema }]),
        MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }]),
        MongooseModule.forFeature([
            { name: Trip.name, schema: TripSchema },
            { name: AssignedBus.name, schema: AssignedBusSchema },
            { name: Amenity.name, schema: AmenitySchema },
            { name: SeatLayout.name, schema: SeatLayoutSchema },
            { name: Counter.name, schema: counterSchema },
            { name: Schedule.name, schema: ScheduleSchema },
        ]),
        MongooseModule.forFeature([{ name: PendingBooking.name, schema: PendingBookingSchema }]),
        MongooseModule.forFeature([{ name: CompletedBooking.name, schema: CompletedBookingSchema }]),
        OwnerModule,
    ],
    controllers: [UsersController, SearchTripController, BookingsController, StripeController, CompletedBookingController],
    providers: [
        UsersService,
        UsersRepository,
        OtpService,
        OtpRepository,
        SearchTripService,
        SearchTripRepository,
        PendingBookingRepository,
        PendingBookingService,
        StripeService,
        CompletedBookingService, 
        CompletedBookingRepository,
        UserBlockedGuard
    ],
    exports: [UsersService, UsersRepository, PendingBookingService, UsersRepository]
})
export class UsersModule { } 