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

@Module({
  imports: [
    MongooseModule.forFeature([{ name: unverifiedOwner.name, schema: UnverifiedOwnerSchema }]),
    MongooseModule.forFeature([{ name: verifiedOwner.name, schema: verifiedOwnerSchema }]),
    MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }]),
    MongooseModule.forFeature([{ name: Counter.name, schema: counterSchema }]),
  ],
  controllers: [OwnerController, CounterController],
  providers: [
    OtpService,
    OtpRepository,
    UnverifiedOwnerRepository,
    OwnerService,
    CounterService,
    CounterRepository
  ],
  exports: [OwnerService, UnverifiedOwnerRepository]
})
export class OwnerModule { }
