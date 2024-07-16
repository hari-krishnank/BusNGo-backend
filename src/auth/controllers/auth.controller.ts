import { Body, Controller, InternalServerErrorException, Logger, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from 'src/busOwner/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private logger:Logger) { }

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
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
