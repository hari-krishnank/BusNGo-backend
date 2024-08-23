import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { AmenityService } from '../services/amenity.service';
import { CreateAmenityDto } from '../dto/create-amenity.dto';
import { UpdateAmenityDto } from '../dto/update-amenity.dto';
import { OwnerJwtAuthGuard } from 'src/guards/jwtAuthGuard/ownerJwt.guard';

@Controller('amenities') 
@UseGuards(OwnerJwtAuthGuard)
export class AmenityController {
    constructor(private readonly amenityService: AmenityService) { }

    @Post()
    create(@Request() req, @Body() createAmenityDto: CreateAmenityDto) {
        const ownerId = req.user.ownerId;
        console.log('Creating amenity for owner:', ownerId);
        return this.amenityService.create(createAmenityDto, ownerId);
    }

    @Get()
    findAll(
        @Request() req,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 5
    ) {
        const ownerId = req.user.ownerId;
        console.log('Fetching amenities for owner:', ownerId);
        return this.amenityService.findAll(ownerId, page, limit);
    }

    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
        const ownerId = req.user.ownerId;
        return this.amenityService.findOne(id, ownerId);
    }

    @Patch(':id')
    update(@Request() req, @Param('id') id: string, @Body() updateAmenityDto: UpdateAmenityDto) {
        const ownerId = req.user.ownerId;
        return this.amenityService.update(id, updateAmenityDto, ownerId);
    }

    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        const ownerId = req.user.ownerId;
        return this.amenityService.remove(id, ownerId);
    }
}