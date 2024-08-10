import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Amenity, AmenityDocument } from '../schemas/amenity.schema';
import { CreateAmenityDto } from '../dto/create-amenity.dto';
import { UpdateAmenityDto } from '../dto/update-amenity.dto';

@Injectable()
export class AmenityRepository {
    constructor(@InjectModel(Amenity.name) private amenityModel: Model<AmenityDocument>) { }

    async create(createAmenityDto: CreateAmenityDto & { ownerId: Types.ObjectId }): Promise<Amenity> {
        const createdAmenity = new this.amenityModel(createAmenityDto);
        return createdAmenity.save();
    }

    async findAll(ownerId: Types.ObjectId): Promise<Amenity[]> {
        return this.amenityModel.find({ ownerId }).exec();
    }
    
    async findOne(id: string, ownerId: Types.ObjectId): Promise<Amenity> {
        return this.amenityModel.findOne({ _id: id, ownerId }).exec();
    }

    async update(id: string, updateAmenityDto: UpdateAmenityDto, ownerId: Types.ObjectId): Promise<Amenity> {
        return this.amenityModel.findOneAndUpdate({ _id: id, ownerId }, updateAmenityDto, { new: true }).exec();
    }

    async remove(id: string, ownerId: Types.ObjectId): Promise<Amenity> {
        return this.amenityModel.findOneAndDelete({ _id: id, ownerId }).exec();
    }
}