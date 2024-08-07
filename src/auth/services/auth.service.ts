import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/services/users.service';
import * as bcrypt from 'bcrypt';
import { OwnerService } from 'src/busOwner/services/owner.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

    private readonly logger = new Logger(AuthService.name);

    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        private ownerService: OwnerService,
        private configService: ConfigService
    ) { }
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
        };
    }

    async login(user: any) {
        if (!user || typeof user !== 'object' || !user.email || !user._id) {
            console.error('Invalid user object:', user);
            throw new Error('Invalid user object');
        }
        const payload = {
            email: user.email,
            sub: user._id.toString()
        };
        console.log('Payload:', payload);
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async validateOwner(email: string, password: string) {
        const owner = await this.ownerService.getOwnerDetails(email);
        if (!owner) {
            this.logger.warn(`Owner not found for email: ${email}`);
            return null;
        }

        if (owner.is_blocked) {
            this.logger.warn(`Blocked owner attempted login: ${email}`);
            return null;
        }

        const passwordMatch = (password === owner.password);
        if (!passwordMatch) {
            this.logger.warn(`Invalid password for email: ${email}`);
            return null;
        }
        return owner
    }
    
    async loginOwner(owner: any) {
        if (!owner || typeof owner !== 'object' || !owner.email || !owner._id) {
            console.error('Invalid owner object:', owner);
            throw new Error('Invalid owner object');
        }
        const payload = { email: owner.email, sub: owner.id, role: 'owner' };
        console.log('payload of the owner login', payload);

        return {
            access_token: this.jwtService.sign(payload, { secret: this.configService.get<string>('JWT_SECRET') }),
        };
    }
}