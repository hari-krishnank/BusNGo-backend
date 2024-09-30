import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { StaffLoginDto } from 'src/busOwner/dto/staffLogin.dto';
import { StaffAuthService } from '../services/staffAuth.service';

@Controller('staff')
export class StaffAuthController {
    constructor(private readonly staffAuthService: StaffAuthService) { }

    @Post('login')
    async login(@Body() loginDto: StaffLoginDto) {
        const staff = await this.staffAuthService.validateStaff(loginDto.email, loginDto.password);
        if (!staff) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.staffAuthService.loginStaff(staff);
    }
}