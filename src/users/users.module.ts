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
import { UserProfileController } from "./controllers/user-profile.controller";
import { UserProfileRepository } from "./repositories/user-profile.repository";
import { UserProfileService } from "./services/user-profile.service";
import { AwsModule } from "src/aws/aws.module";
import { CoTravellerController } from "./controllers/co-traveller.controller";
import { CoTravellerRepository } from "./repositories/co-traveller.repository";
import { CoTravellerService } from "./services/co-traveller.service";
import { CoTraveller, CoTravellerSchema } from "./schemas/co-traveller.schema";
import { WalletTransaction, WalletTransactionSchema } from "./schemas/walletTransaction.schema";
import { WalletController } from "./controllers/wallet.controller";
import { WalletStripeService } from "./services/wallet-stripe.service";
import { WalletTransactionService } from "./services/wallet-transaction.service";
import { CancellationService } from "./services/cancellation.service";
import { CancelledBookingRepository } from "./repositories/cancelled-booking.repository";
import { CancelledBookingService } from "./services/cancelled-booking.service";

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
        MongooseModule.forFeature([{ name: CoTraveller.name, schema: CoTravellerSchema }]),
        MongooseModule.forFeature([{ name: WalletTransaction.name, schema: WalletTransactionSchema }]),
        OwnerModule,
        AwsModule
    ],
    controllers: [UsersController, SearchTripController, BookingsController, StripeController, CompletedBookingController, UserProfileController, CoTravellerController, WalletController],
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
        UserBlockedGuard,
        UserProfileRepository,
        UserProfileService,
        CoTravellerRepository,
        CoTravellerService,
        WalletStripeService,
        WalletTransactionService,
        CancellationService,
        CancelledBookingRepository,
        CancelledBookingService
    ],
    exports: [UsersService, UsersRepository, PendingBookingService, UsersRepository, UserProfileService]
})
export class UsersModule { }