import { Body, Controller, Get, InternalServerErrorException, Logger, Post, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from 'src/busOwner/dto/login.dto';
import { JwtAuthGuard } from 'src/guards/jwtAuthGuard/jwt.guard';
import { UsersService } from 'src/users/services/users.service';

@Controller('auth')
export class AuthController {
  
  constructor(private authService: AuthService, private logger: Logger, private usersService: UsersService) { }

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    try {
      const user = await this.authService.validateUser(loginDto.email, loginDto.password);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      if (user.is_blocked) {
        throw new UnauthorizedException('Your account has been blocked. Please contact support.');
      }
      console.log('User object before login:', user);
      const result = await this.authService.login(user);
      console.log('Login result:', result);
      return result;
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred during login');
    }
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
      const owner = await this.authService.validateOwner(loginDto.email, loginDto.password);
      if (!owner) {
        throw new UnauthorizedException('Invalid credentials');
      }
     
      console.log('User object before login:', owner);
      const result = await this.authService.loginOwner(owner);
      console.log('Login result:', result);
      return result;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(`Login failed for ${loginDto.email}:`, error);
      throw new InternalServerErrorException('An error occurred during login');
    }
  }
}
