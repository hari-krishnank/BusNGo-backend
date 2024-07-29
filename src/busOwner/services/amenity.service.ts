import { Injectable } from '@nestjs/common';
import { AmenityRepository } from '../repositories/amenity.repository';
import { CreateAmenityDto } from '../dto/create-amenity.dto';
import { Amenity } from '../schemas/amenity.schema';
import { UpdateAmenityDto } from '../dto/update-amenity.dto';

@Injectable()
export class AmenityService {
    constructor(private readonly amenityRepository: AmenityRepository) { }

    create(createAmenityDto: CreateAmenityDto): Promise<Amenity> {
        return this.amenityRepository.create(createAmenityDto);
    }

    findAll(): Promise<Amenity[]> {
        return this.amenityRepository.findAll();
    }

    findOne(id: string): Promise<Amenity> {
        return this.amenityRepository.findOne(id);
    }

    update(id: string, updateAmenityDto: UpdateAmenityDto): Promise<Amenity> {
        return this.amenityRepository.update(id, updateAmenityDto);
    }

    remove(id: string): Promise<Amenity> {
        return this.amenityRepository.remove(id);
    }
}