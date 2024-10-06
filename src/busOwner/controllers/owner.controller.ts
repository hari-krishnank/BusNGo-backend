import { BadRequestException, Body, Controller, Get, HttpException, HttpStatus, Post, Put, Query, Req } from '@nestjs/common';
import { OtpService } from 'src/users/services/otp.service';
import { CreateOwnerDto } from '../dto/create-owner.dto';
import { OwnerService } from '../services/owner.service';
import { UpdateOwnerDetailsDto } from '../dto/update-owner-details.dto';
import { IOwner } from '../interfaces/owner.interface';

@Controller('owner')
export class OwnerController {
    constructor(private readonly otpService: OtpService, private ownerService: OwnerService) { }

    @Post('otp')
    async sendOtp(@Body() createOwnerDto: CreateOwnerDto): Promise<{ message: string }> {
        await this.ownerService.initiateOwnerRegistration(createOwnerDto);
        return { message: 'OTP sent successfully' };
    }

    @Post('verify-otp')
    async verifyOtp(@Body('email') email: string, @Body('otp') otp: number): Promise<boolean> {
        const isValid = await this.otpService.verifyOtp(email, otp);
        console.log(isValid);
        if (!isValid) {
            throw new HttpException('Invalid OTP. Please try again.', HttpStatus.BAD_REQUEST)
        }
        return isValid;
    }

    @Post('resend-otp')
    async resendOtp(@Body('email') email: string): Promise<{ message: string }> {
        await this.otpService.resendOTP(email);
        return { message: 'OTP resent successfully' };
    }

    @Put('update-details')
    async updateOwnerDetails(@Body() updateOwnerDetailsDto: UpdateOwnerDetailsDto): Promise<{ message: string }> {
        console.log('Payload received:', updateOwnerDetailsDto);
        const res = await this.ownerService.updateOwnerDetails(updateOwnerDetailsDto);
        return { message: 'Owner details updated successfully' };
    }

    @Get('details')
    async getOwnerDetails(@Query('email') email: string): Promise<IOwner> {
        return this.ownerService.getOwnerDetails(email);
    }

    @Post('confirm-details')
    async confirmOwnerDetails(@Body('email') email: string): Promise<{ message: string }> {
        const isRequestSent = await this.ownerService.confirmOwnerDetails(email);
        if (isRequestSent) {
            return { message: 'Registration request sent successfully' };
        } else {
            throw new BadRequestException('Error sending registration request');
        }
    }
}