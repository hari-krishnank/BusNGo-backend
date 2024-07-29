import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Amenity, AmenityDocument } from '../schemas/amenity.schema';
import { CreateAmenityDto } from '../dto/create-amenity.dto';
import { UpdateAmenityDto } from '../dto/update-amenity.dto';

@Injectable()
export class AmenityRepository {
    constructor(
        @InjectModel(Amenity.name) private amenityModel: Model<AmenityDocument>,
    ) { }

    async create(createAmenityDto: CreateAmenityDto): Promise<Amenity> {
        const createdAmenity = new this.amenityModel(createAmenityDto);
        return createdAmenity.save();
    }

    async findAll(): Promise<Amenity[]> {
        return this.amenityModel.find().exec();
    }

    async findOne(id: string): Promise<Amenity> {
        return this.amenityModel.findById(id).exec();
    }

    async update(id: string, updateAmenityDto: UpdateAmenityDto): Promise<Amenity> {
        return this.amenityModel.findByIdAndUpdate(id, updateAmenityDto, { new: true }).exec();
    }

    async remove(id: string): Promise<Amenity> {
        return this.amenityModel.findByIdAndDelete(id).exec();
    }
}