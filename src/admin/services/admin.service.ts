import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    async login(email: string, password: string) {
        const adminEmail = this.configService.get<string>('admin.email');
        const adminPassword = this.configService.get<string>('admin.pass');

        if (email === adminEmail && password === adminPassword) {
            const payload = { email, isAdmin: true };
            return {
                access_token: this.jwtService.sign(payload),
            };
        } else {
            throw new UnauthorizedException('Invalid credentials');
        }
    }
}