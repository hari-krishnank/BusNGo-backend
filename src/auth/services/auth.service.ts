import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/services/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    private readonly logger = new Logger(AuthService.name);
    
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            this.logger.warn(`User not found for email: ${email}`);
            return null;
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
}