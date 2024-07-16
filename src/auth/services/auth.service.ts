import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/services/users.service';
import * as bcrypt from 'bcrypt';
import { OwnerService } from 'src/busOwner/services/owner.service';

@Injectable()
export class AuthService {

    private readonly logger = new Logger(AuthService.name);

    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        private ownerService: OwnerService
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

        const { password: _, ...result } = user;
        return result;
    }

    async login(user: any) {


        const payload = { email: user.email, sub: user._id };
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

        const { password: _, ...result } = owner;
        return result;
    }

    async loginOwner(email: string, password: string) {
        const owner = await this.validateOwner(email, password);
        if (!owner) {
            throw new UnauthorizedException('Invalid credentials or account is blocked');
        }
        const payload = { email: owner.email, sub: owner.email };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}