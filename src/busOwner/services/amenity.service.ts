import { Injectable } from '@nestjs/common';
import { AmenityRepository } from '../repositories/amenity.repository';
import { CreateAmenityDto } from '../dto/create-amenity.dto';
import { Amenity } from '../schemas/amenity.schema';
import { UpdateAmenityDto } from '../dto/update-amenity.dto';
import { Types } from 'mongoose';

@Injectable()
export class AmenityService {
    constructor(private readonly amenityRepository: AmenityRepository) { }

    create(createAmenityDto: CreateAmenityDto, ownerId: string): Promise<Amenity> {
        const amenityWithOwner = {
            ...createAmenityDto,
            ownerId: new Types.ObjectId(ownerId)
        };
        return this.amenityRepository.create(amenityWithOwner);
    }

    findAll(ownerId: string): Promise<Amenity[]> {
        return this.amenityRepository.findAll(new Types.ObjectId(ownerId));
    }

    findOne(id: string, ownerId: string): Promise<Amenity> {
        return this.amenityRepository.findOne(id, new Types.ObjectId(ownerId));
    }

    update(id: string, updateAmenityDto: UpdateAmenityDto, ownerId: string): Promise<Amenity> {
        return this.amenityRepository.update(id, updateAmenityDto, new Types.ObjectId(ownerId));
    }

    remove(id: string, ownerId: string): Promise<Amenity> {
        return this.amenityRepository.remove(id, new Types.ObjectId(ownerId));
    }
}