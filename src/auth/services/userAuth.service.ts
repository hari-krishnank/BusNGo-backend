import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/services/users.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class UserAuthService {
    private readonly logger = new Logger(UserAuthService.name);
    private googleClient: OAuth2Client;

    constructor(private userService: UsersService, private jwtService: JwtService, private configService: ConfigService) {
        this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }

    async validateUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            this.logger.warn(`User not found for email: ${email}`);
            return null;
        }

        if (user.is_blocked) {
            throw new UnauthorizedException('Your account has been blocked. Please contact support.');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            this.logger.warn(`Invalid password for email: ${email}`);
            return null;
        }
        return {
            _id: user._id,
            email: user.email,
            username: user.username,
            is_blocked: user.is_blocked,
            phone: user.phone
        };
    }

    async login(user: any) {
        if (!user || typeof user !== 'object' || !user.email || !user._id) {
            console.error('Invalid user object:', user);
            throw new Error('Invalid user object');
        }
        const payload = {
            email: user.email,
            sub: user._id.toString(),
            role: 'user'
        };
        console.log('Payload:', payload);
        return {
            access_token: this.jwtService.sign(payload, { secret: this.configService.get<string>('JWT_SECRET') }),
            user: {
                userId: user._id,
                email: user.email,
                username: user.username,
                phone: user.phone
            }
        };
    }

    async googleLogin(credential: string) {
        const ticket = await this.googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const email = payload.email;

        let user = await this.userService.findByEmail(email);
        if (!user) {
            // user = await this.userService.create({
            //     email: email, 
            //     username: payload.name,
            //     // Add other necessary fields
            // });
        }
        return this.login(user);
    }
}