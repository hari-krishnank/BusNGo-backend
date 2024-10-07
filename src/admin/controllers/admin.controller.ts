import { Body, Controller, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
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
        return { isValid: true };
    }

    @UseGuards(AdminJwtAuthGuard)
    @Get('verified-users')
    async getVerifiedUsers(@Request() req, @Query('page') page: number = 1, @Query('limit') limit: number = 5) {
        return this.adminService.getVerifiedUsers(page, limit);
    }

    @UseGuards(AdminJwtAuthGuard)
    @Get('verified-owners')
    async getVerifiedOwners(@Request() req, @Query('page') page: number = 1, @Query('limit') limit: number = 5) {
        return this.adminService.getVerifiedOwners(page, limit);
    }

    @UseGuards(AdminJwtAuthGuard)
    @Put('toggle-user-block/:userId')
    async toggleUserBlock(@Param('userId') userId: string, @Body('isBlocked') isBlocked: boolean) {
        return this.adminService.blockUser(userId, isBlocked);
    }

    @UseGuards(AdminJwtAuthGuard)
    @Put('toggle-owner-block/:ownerId')
    async toggleOwnerBlock(@Param('ownerId') ownerId: string, @Body('isBlocked') isBlocked: boolean) {
        return this.adminService.blockOwner(ownerId, isBlocked);
    }

    @UseGuards(AdminJwtAuthGuard)
    @Get('owner-registration-requests')
    async getOwnerRegistrationRequests(@Query('page') page: number = 1, @Query('limit') limit: number = 5) {
        return this.adminService.getOwnerRegistrationRequests(page, limit);
    }

    @UseGuards(AdminJwtAuthGuard)
    @Get('pending-owner-requests-count')
    async getPendingOwnerRequestsCount() {
        return { count: await this.adminService.getPendingOwnerRequestsCount() };
    }

    @UseGuards(AdminJwtAuthGuard)
    @Post('approve-owner-registration/:email')
    async approveOwnerRegistration(@Param('email') email: string) {
        return this.adminService.approveOwnerRegistration(email);
    }

    @UseGuards(AdminJwtAuthGuard)
    @Post('reject-owner-registration/:email')
    async rejectOwnerRegistration(@Param('email') email: string) {
        return this.adminService.rejectOwnerRegistration(email);
    }

    @UseGuards(AdminJwtAuthGuard)
    @Get('rejected-owner-requests')
    async getRejectedOwnerRequests(@Query('page') page: number = 1, @Query('limit') limit: number = 5) {
        return this.adminService.getRejectedOwnerRequests(page, limit);
    }
}