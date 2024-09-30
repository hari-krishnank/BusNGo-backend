import { Controller, Post, Body, Request, UseGuards, Get, HttpException, HttpStatus } from '@nestjs/common';
import { StaffService } from '../services/staff.service';
import { CreateStaffDto } from '../dto/create-staff.dto';
import { Staff } from '../interfaces/staff.interface';
import { OwnerJwtAuthGuard } from 'src/guards/jwtAuthGuard/ownerJwt.guard';

@Controller('staff')
@UseGuards(OwnerJwtAuthGuard)
export class StaffController {
    constructor(private readonly staffService: StaffService) { }

    @Post()
    async create(@Request() req, @Body() createStaffDto: CreateStaffDto): Promise<Omit<Staff, 'password'>> {
        try {
            const ownerId = req.user.ownerId;
            return await this.staffService.create(createStaffDto, ownerId);
        } catch (error) {
            if (error.message === 'Email already in use') {
                throw new HttpException('Email already in use', HttpStatus.CONFLICT);
            }
            throw error;
        }
    }

    @Get()
    async getStaffsByOwner(@Request() req): Promise<Staff[]> {
        const ownerId = req.user.ownerId;
        return this.staffService.getStaffsByOwnerId(ownerId);
    }
}