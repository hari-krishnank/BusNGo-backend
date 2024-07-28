import { Body, Controller, Get, InternalServerErrorException, Logger, Post, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from 'src/busOwner/dto/login.dto';
import { JwtAuthGuard } from 'src/guards/jwtAuthGuard/jwtguard';
import { UsersService } from 'src/users/services/users.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private logger: Logger, private usersService: UsersService) { }

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (user.is_blocked) {
      throw new UnauthorizedException('Your account has been blocked. Please contact support.');
    }
    return this.authService.login(user);
  }

  @Get('check-block-status')
  @UseGuards(JwtAuthGuard)
  async checkBlockStatus(@Request() req) {
    const user = await this.usersService.findByEmail(req.user.email);
    return user.is_blocked;
  }


  @Post('owner/login')
  async loginOwner(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.loginOwner(loginDto.email, loginDto.password);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(`Login failed for ${loginDto.email}:`, error);
      throw new InternalServerErrorException('An error occurred during login');
    }
  }
}
