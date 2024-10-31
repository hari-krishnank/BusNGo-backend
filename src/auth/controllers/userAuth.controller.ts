import { Body, Controller, InternalServerErrorException, Post, UnauthorizedException } from '@nestjs/common';
import { UserAuthService } from '../services/userAuth.service';

@Controller('auth/user')
export class UserAuthController {
    constructor(private userAuthService: UserAuthService) { }

    @Post('login')
    async login(@Body() loginDto: { email: string; password: string }) {
        try {
            const user = await this.userAuthService.validateUser(loginDto.email, loginDto.password);
            if (!user) {
                throw new UnauthorizedException('Invalid credentials');
            }
            if (user.is_blocked) {
                throw new UnauthorizedException('Your account has been blocked. Please contact support.');
            }
            console.log('User object before login:', user);
            const result = await this.userAuthService.login(user);
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

    @Post('google-login')
    async googleLogin(@Body('credential') credential: string) {
        return this.userAuthService.googleLogin(credential);
    }

    @Post('refresh')
    async refreshToken(@Body() body: { refreshToken: string }) {
        console.log('body',body);
        return this.userAuthService.refreshTokens(body.refreshToken);
    }
}