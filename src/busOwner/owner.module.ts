import { Module } from '@nestjs/common';
import { OwnerController } from './controllers/owner.controller';
import { OtpService } from 'src/users/services/otp.service';
import { OtpRepository } from 'src/users/repositories/otp.repository';
import { Otp, OtpSchema } from 'src/users/schemas/otp.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UnverifiedOwnerRepository } from './repositories/unverified-owner.repository';
import { unverifiedOwner, UnverifiedOwnerSchema } from './schemas/unverifiedOwner.schema';
import { OwnerService } from './services/owner.service';
import { verifiedOwner, verifiedOwnerSchema } from './schemas/verifiedOwner.schema';
import { CounterController } from './controllers/counter.controller';
import { Counter, counterSchema } from './schemas/counter.schema';
import { CounterService } from './services/counter.service';
import { CounterRepository } from './repositories/counters.repositories';
import { Amenity, AmenitySchema } from './schemas/amenity.schema';
import { AmenityService } from './services/amenity.service';
import { AmenityRepository } from './repositories/amenity.repository';
import { AmenityController } from './controllers/amenity.controller';
import { SeatLayout, SeatLayoutSchema } from './schemas/seat-layout.schema';
import { SeatLayoutsService } from './services/seat-layouts.service';
import { SeatLayoutsController } from './controllers/seatlayout.controller';
import { FleetType, FleetTypeSchema } from './schemas/fleet-type.schema';
import { FleetTypeController } from './controllers/fleet-type.controller';
import { FleetTypeRepository } from './repositories/fleet-type.repository';
import { FleetTypeService } from './services/fleet-type.service';
import { Bus, BusSchema } from './schemas/bus.schema';
import { BusController } from './controllers/bus.controller';
import { BusService } from './services/bus.service';
import { BusRepository } from './repositories/bus.repository';
import { Route, RouteSchema } from './schemas/route.schema';
import { RouteController } from './controllers/route.controller';
import { RouteRepository } from './repositories/route.repository';
import { RouteService } from './services/route.service';
import { Schedule, ScheduleSchema } from './schemas/schedule.schema';
import { ScheduleController } from './controllers/schedule.controller';
import { ScheduleService } from './services/schedule.service';
import { ScheduleRepository } from './repositories/schedule.repository';
import { Trip, TripSchema } from './schemas/trip.schema';
import { TripController } from './controllers/trip.controller';
import { TripRepository } from './repositories/trip.repository';
import { TripService } from './services/trip.service';
import { AssignedBus, AssignedBusSchema } from './schemas/assigned-bus.schema';
import { AssignedBusController } from './controllers/assigned-bus.controller';
import { AssignedBusRepository } from './repositories/assigned-bus.repository';
import { AssignedBusService } from './services/assigned-bus.service';
import { Staffs, StaffsSchema } from './schemas/staff.schema';
import { StaffController } from './controllers/staff.controller';
import { StaffService } from './services/staff.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: unverifiedOwner.name, schema: UnverifiedOwnerSchema }]),
    MongooseModule.forFeature([{ name: verifiedOwner.name, schema: verifiedOwnerSchema }]),
    MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }]),
    MongooseModule.forFeature([{ name: Counter.name, schema: counterSchema }]),
    MongooseModule.forFeature([{ name: Amenity.name, schema: AmenitySchema }]),
    MongooseModule.forFeature([{ name: SeatLayout.name, schema: SeatLayoutSchema }]),
    MongooseModule.forFeature([{ name: FleetType.name, schema: FleetTypeSchema }]),
    MongooseModule.forFeature([{ name: Bus.name, schema: BusSchema }]),
    MongooseModule.forFeature([{ name: Route.name, schema: RouteSchema }]),
    MongooseModule.forFeature([{ name: Schedule.name, schema: ScheduleSchema }]),
    MongooseModule.forFeature([{ name: Trip.name, schema: TripSchema }]),
    MongooseModule.forFeature([{ name: AssignedBus.name, schema: AssignedBusSchema }]),
    MongooseModule.forFeature([{ name: Staffs.name, schema: StaffsSchema }])
  ],
  controllers: [OwnerController, CounterController, AmenityController, SeatLayoutsController, FleetTypeController, BusController, RouteController, ScheduleController, TripController, AssignedBusController, StaffController],
  providers: [
    OtpService,
    OtpRepository,
    UnverifiedOwnerRepository, 
    OwnerService,
    CounterService,
    CounterRepository,
    AmenityService,
    AmenityRepository,
    SeatLayoutsService,
    FleetTypeService,
    FleetTypeRepository,
    BusService,
    BusRepository,
    RouteService,
    RouteRepository,
    ScheduleService,
    ScheduleRepository,
    TripRepository,
    TripService,
    AssignedBusService,
    AssignedBusRepository,
    StaffService
  ],
  exports: [OwnerService, UnverifiedOwnerRepository, FleetTypeService, RouteService, ScheduleService, AssignedBusService, StaffService, TripRepository]
})
export class OwnerModule { }