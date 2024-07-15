import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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
}