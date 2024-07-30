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

@Module({
  imports: [
    MongooseModule.forFeature([{ name: unverifiedOwner.name, schema: UnverifiedOwnerSchema }]),
    MongooseModule.forFeature([{ name: verifiedOwner.name, schema: verifiedOwnerSchema }]),
    MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }]),
    MongooseModule.forFeature([{ name: Counter.name, schema: counterSchema }]),
    MongooseModule.forFeature([{ name: Amenity.name, schema: AmenitySchema }]),
    MongooseModule.forFeature([{ name: SeatLayout.name, schema: SeatLayoutSchema }]),
    MongooseModule.forFeature([{ name: FleetType.name, schema: FleetTypeSchema }]),
  ],
  controllers: [OwnerController, CounterController, AmenityController, SeatLayoutsController, FleetTypeController],
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
    FleetTypeRepository
  ],
  exports: [OwnerService, UnverifiedOwnerRepository, FleetTypeService]
}) 
export class OwnerModule { }