import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/user.schema";
import { UsersController } from "./controllers/users.controller";
import { UsersRepository } from "./repositories/users.repository";
import { UsersService } from "./services/users.service";
import { OtpService } from './services/otp.service';
import { Otp, OtpSchema } from "./schemas/otp.schema";
import { OtpRepository } from "./repositories/otp.repository";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema}]),
    ],
    controllers: [UsersController],
    providers: [
        UsersService, 
        UsersRepository, 
        OtpService,
        OtpRepository
    ],
    exports: [UsersService]
})
export class UsersModule {}