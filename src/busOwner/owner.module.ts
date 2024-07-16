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

@Module({
  imports: [
    MongooseModule.forFeature([{ name: unverifiedOwner.name, schema: UnverifiedOwnerSchema }]),
    MongooseModule.forFeature([{ name: verifiedOwner.name, schema: verifiedOwnerSchema }]),
    MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }]),
  ],
  controllers: [OwnerController],
  providers: [
    OtpService,
    OtpRepository,
    UnverifiedOwnerRepository,
    OwnerService
  ],
  exports: [OwnerService, UnverifiedOwnerRepository]
})
export class OwnerModule { }
