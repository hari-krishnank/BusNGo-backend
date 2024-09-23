import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from '../services/users.service';
import { VerifyOtpDto } from '../dto/verifyOtp.dto';
import { OtpService } from '../services/otp.service';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';

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

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    try {
      await this.usersService.forgotPassword(forgotPasswordDto.email);
      return { message: 'If an account with that email exists, we have sent a password reset link.' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    try {
      await this.usersService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword);
      return { message: 'Password has been reset successfully.' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}