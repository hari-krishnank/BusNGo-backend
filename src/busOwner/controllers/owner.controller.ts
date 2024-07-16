import { BadRequestException, Body, Controller, Get, Post, Put, Query, Req } from '@nestjs/common';
import { OtpService } from 'src/users/services/otp.service';
import { CreateOwnerDto } from '../dto/create-owner.dto';
import { OwnerService } from '../services/owner.service';
import { UpdateOwnerDetailsDto } from '../dto/update-owner-details.dto';
import { IOwner } from '../interfaces/owner.interface';

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
        console.log('Payload received:', updateOwnerDetailsDto);
        // console.log('update-details endpoint hit');
        const res = await this.ownerService.updateOwnerDetails(updateOwnerDetailsDto);
        return { message: 'Owner details updated successfully' };
    }

    @Get('details')
    async getOwnerDetails(@Query('email') email: string): Promise<IOwner> {
        return this.ownerService.getOwnerDetails(email);
    }

    @Post('confirm-details')
    async confirmOwnerDetails(@Body('email') email: string): Promise<{ message: string }> {
        const isSaved = await this.ownerService.confirmOwnerDetails(email);
        if (isSaved) {
            return { message: 'Owner confirmed and saved to verified collection successfully' };
        } else {
            throw new BadRequestException('Error confirming owner details');
        }
    }
}