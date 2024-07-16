import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { JwtAuthGuard } from 'src/guards/jwtAuthGuard/jwtguard';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Post('login')
    async login(@Body() loginData: { email: string; password: string }) {
        return this.adminService.login(loginData.email, loginData.password);
    }

    @UseGuards(JwtAuthGuard)
    @Get('verify')
    async verifyToken() {
        console.log('verify....');

        return { isValid: true };
    }

    @UseGuards(JwtAuthGuard)
    @Get('verified-users')
    async getVerifiedUsers() {
        return this.adminService.getVerifiedUsers();
    }

    @UseGuards(JwtAuthGuard)
    @Get('verified-owners')
    async getVerifiedOwners() {
        return this.adminService.getVerifiedOwners();
    }


    @UseGuards(JwtAuthGuard)
    @Put('owner/:id/block')
    async updateOwnerBlockStatus(@Param('id') id: string, @Body('isBlocked') isBlocked: boolean) {
        return this.adminService.updateOwnerBlockStatus(id, isBlocked);
    }
}