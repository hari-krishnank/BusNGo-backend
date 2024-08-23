import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { AdminJwtAuthGuard } from 'src/guards/jwtAuthGuard/adminJwt.guard';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Post('login')
    async login(@Body() loginData: { email: string; password: string }) {
        return this.adminService.login(loginData.email, loginData.password);
    }

    @UseGuards(AdminJwtAuthGuard)
    @Get('verify')
    async verifyToken() {
        console.log('verify....');

        return { isValid: true };
    }

    @UseGuards(AdminJwtAuthGuard)
    @Get('verified-users')
    async getVerifiedUsers() {
        return this.adminService.getVerifiedUsers();
    }

    @UseGuards(AdminJwtAuthGuard)
    @Get('verified-owners')
    async getVerifiedOwners() {
        return this.adminService.getVerifiedOwners();
    }


    @UseGuards(AdminJwtAuthGuard)
    @Put('owner/:id/block')
    async updateOwnerBlockStatus(@Param('id') id: string, @Body('isBlocked') isBlocked: boolean) {
        return this.adminService.updateOwnerBlockStatus(id, isBlocked);
    }

    @UseGuards(AdminJwtAuthGuard)
    @Put('user/:id/block')
    async updateUserBlockStatus(@Param('id') id: string, @Body('isBlocked') isBlocked: boolean) {
        return this.adminService.updateUserBlockStatus(id, isBlocked);
    }
}