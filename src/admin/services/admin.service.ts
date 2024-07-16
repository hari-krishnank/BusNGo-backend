import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UnverifiedOwnerRepository } from 'src/busOwner/repositories/unverified-owner.repository';
import { UsersRepository } from 'src/users/repositories/users.repository';

@Injectable()
export class AdminService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly usersRepository: UsersRepository,
        private readonly ownersRepository: UnverifiedOwnerRepository,
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


    async getVerifiedUsers() {
        return this.usersRepository.getVerifiedUsers();
    }

    async getVerifiedOwners() {
        return this.ownersRepository.getVerifiedOwners();
    }

    async updateOwnerBlockStatus(id: string, isBlocked: boolean) {
        return this.ownersRepository.updateOwnerBlockStatus(id, isBlocked);
    }


    async updateUserBlockStatus(id: string, isBlocked: boolean) {
        return this.usersRepository.updateUserBlockStatus(id, isBlocked);
    }
}