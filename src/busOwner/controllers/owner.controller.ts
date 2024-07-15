import { Body, Controller, Post, Put } from '@nestjs/common';
import { OtpService } from 'src/users/services/otp.service';
import { CreateOwnerDto } from '../dto/create-owner.dto';
import { OwnerService } from '../services/owner.service';
import { UpdateOwnerDetailsDto } from '../dto/update-owner-details.dto';

@Controller('owner')
export class OwnerController {
    constructor(
        private readonly otpService: OtpService,
        private ownerService: OwnerService
    ) { }

    @Post('otp')
    async sendOtp(@Body() createOwnerDto: CreateOwnerDto): Promise<{ message: string }> {
        await this.ownerService.initiateOwnerRegistration(createOwnerDto);
        return { message: 'OTP sent successfully' };
    }

    @Post('verify-otp')
    async verifyOtp(@Body('email') email: string, @Body('otp') otp: number): Promise<boolean> {
        const isValid = await this.otpService.verifyOtp(email, otp);
        // console.log(isValid,otp);
        return isValid;
    }

    @Put('update-details')
    async updateOwnerDetails(@Body() updateOwnerDetailsDto: UpdateOwnerDetailsDto): Promise<{ message: string }> {
        console.log('update-details endpoint hit');
        const res = await this.ownerService.updateOwnerDetails(updateOwnerDetailsDto);
        return { message: 'Owner details updated successfully' };
    }
}
