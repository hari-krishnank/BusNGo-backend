import { Body, Controller, InternalServerErrorException, Logger, Post, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from 'src/busOwner/dto/login.dto';
import { OwnerAuthService } from '../services/ownerAuth.service';

@Controller('auth/owner')
export class OwnerAuthController {
    constructor(private ownerAuthService: OwnerAuthService, private logger: Logger) { }

    @Post('login') 
    async loginOwner(@Body() loginDto: LoginDto) {
        try {
            const owner = await this.ownerAuthService.validateOwner(loginDto.email, loginDto.password);
            if (!owner) {
                throw new UnauthorizedException('Invalid credentials');
            }
            console.log('Owner object before login:', owner);
            const result = await this.ownerAuthService.loginOwner(owner);
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