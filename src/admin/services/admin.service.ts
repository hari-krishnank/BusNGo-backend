import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
            const payload = { email, isAdmin: true, role: 'admin' };
            return {
                access_token: this.jwtService.sign(payload, { secret: this.configService.get<string>('JWT_ADMIN_SECRET') }),
            };
        } else {
            throw new UnauthorizedException('Invalid credentials');
        }
    }

    async getVerifiedUsers(page: number, limit: number): Promise<{ users: any[], total: number }> {
        const skip = (page - 1) * limit;
        return this.usersRepository.getVerifiedUsers(skip, limit);
    }

    async getVerifiedOwners(page: number, limit: number): Promise<{ owners: any[], total: number }> {
        const skip = (page - 1) * limit;
        return this.ownersRepository.getVerifiedOwners(skip, limit);
    }

    async blockUser(userId: string, isBlocked: boolean) {
        const user = await this.usersRepository.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        user.is_blocked = isBlocked;
        await this.usersRepository.updateUserBlockStatus(userId, isBlocked);
        return { message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully` };
    }

    async blockOwner(ownerId: string, isBlocked: boolean) {
        const owner = await this.ownersRepository.findById(ownerId);
        if (!owner) {
            throw new NotFoundException('User not found');
        }
        owner.is_blocked = isBlocked;
        await this.ownersRepository.updateOwnerBlockStatus(ownerId, isBlocked);
        return { message: `Owner ${isBlocked ? 'blocked' : 'unblocked'} successfully` };
    }

    async getOwnerRegistrationRequests(page: number, limit: number) {
        const skip = (page - 1) * limit;
        return this.ownersRepository.getOwnerRegistrationRequests(page, limit);
    }

    async getRejectedOwnerRequests(page: number, limit: number) {
        const skip = (page - 1) * limit;
        return this.ownersRepository.getRejectedOwnerRequests(page, limit);
    }

    async getPendingOwnerRequestsCount(): Promise<number> {
        return this.ownersRepository.getPendingRequestsCount();
    }

    async approveOwnerRegistration(email: string) {
        try {
            const approvedOwner = await this.ownersRepository.approveOwnerRegistration(email);
            return { message: 'Owner registration approved successfully', owner: approvedOwner };
        } catch (error) {
            throw new NotFoundException('Owner registration request not found');
        }
    }

    async rejectOwnerRegistration(email: string) {
        const rejectedOwner = await this.ownersRepository.rejectOwnerRegistration(email);
        return rejectedOwner;
    }
}