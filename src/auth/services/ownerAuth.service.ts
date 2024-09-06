import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OwnerService } from 'src/busOwner/services/owner.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OwnerAuthService {
    private readonly logger = new Logger(OwnerAuthService.name);

    constructor(private jwtService: JwtService, private ownerService: OwnerService, private configService: ConfigService) { }

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
        return owner;
    }

    async loginOwner(owner: any) {
        if (!owner || typeof owner !== 'object' || !owner.email || !owner._id) {
            console.error('Invalid owner object:', owner);
            throw new Error('Invalid owner object');
        }
        const payload = { email: owner.email, sub: owner.id, role: 'owner' };
        console.log('payload of the owner login', payload);

        return {
            access_token: this.jwtService.sign(payload, { secret: this.configService.get<string>('JWT_OWNER_SECRET') }),
        };
    }
}