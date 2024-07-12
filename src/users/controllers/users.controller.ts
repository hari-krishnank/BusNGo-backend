import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from '../services/users.service';
import { VerifyOtpDto } from '../dto/verifyOtp.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

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
}
