import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TicketPrice } from '../schemas/ticket-price.schema';
import { CreateTicketPriceDto } from '../dto/create-ticket-price.dto';

@Injectable()
export class TicketPriceRepository {
    constructor(
        @InjectModel(TicketPrice.name) private ticketPriceModel: Model<TicketPrice>,
    ) { }

    async create(createTicketPriceDto: CreateTicketPriceDto & { ownerId: Types.ObjectId }): Promise<TicketPrice> {
        const createdTicketPrice = new this.ticketPriceModel(createTicketPriceDto);
        return createdTicketPrice.save();
    }

    async findAll(ownerId: Types.ObjectId): Promise<TicketPrice[]> {
        return this.ticketPriceModel.find({ ownerId }).populate('fleetType').populate('route').exec();
    }
}