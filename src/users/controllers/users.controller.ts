import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from '../services/users.service';
import { VerifyOtpDto } from '../dto/verifyOtp.dto';
import { OtpService } from '../services/otp.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly otpService: OtpService) { }

  @Post('/register')
  async initiateRegistration(@Body() createUserDto: CreateUserDto): Promise<{ message: string }> {
    await this.usersService.initiateRegistration(createUserDto);
    return { message: 'OTP sent successfully' };
  }

  @Post('/verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto): Promise<{ success: boolean }> {
    const isValid = await this.usersService.verifyOtp(verifyOtpDto);
    return { success: isValid };
  }

  @Post('resend-otp')
  async resendOtp(@Body('email') email: string) {
    try {
      await this.otpService.resendOTP(email);
      return { message: 'OTP resent successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

}
