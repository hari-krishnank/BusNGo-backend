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
import { SearchTripRepository } from "./repositories/search-trip.repository.dto";
import { AssignedBus, AssignedBusSchema } from "src/busOwner/schemas/assigned-bus.schema";

@Module({
    imports: [  
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([{ name: UnVerifiedUser.name, schema: UnVerifiedUserSchema }]),
        MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }]),
        MongooseModule.forFeature([
            { name: Trip.name, schema: TripSchema },
            { name: AssignedBus.name, schema: AssignedBusSchema }
        ]),
        OwnerModule,
    ],
    controllers: [UsersController, SearchTripController],
    providers: [
        UsersService,
        UsersRepository,
        OtpService,
        OtpRepository,
        SearchTripService,
        SearchTripRepository
    ],
    exports: [UsersService, UsersRepository]
})
export class UsersModule { }