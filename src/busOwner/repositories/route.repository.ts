import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Route } from '../schemas/route.schema';
import { CreateRouteDto } from '../dto/create-route.dto';

@Injectable()
export class RouteRepository {
    constructor(@InjectModel(Route.name) private routeModel: Model<Route>) { }

    async create(createRouteDto: CreateRouteDto & { ownerId: Types.ObjectId }): Promise<Route> {
        const createdRoute = new this.routeModel(createRouteDto);
        return createdRoute.save();
    }

    async findAll(ownerId: Types.ObjectId, skip: number, limit: number): Promise<{ routes: Route[], total: number }> {
        const [routes, total] = await Promise.all([
            this.routeModel.find({ ownerId }).skip(skip).limit(limit).populate('startingPoint').populate('endingPoint').populate('additionalStops').exec(),
            this.routeModel.countDocuments({ ownerId })
        ])
        return { routes, total }
    }

    async findById(id: string): Promise<Route> {
        return this.routeModel.findById(id).exec();
    }
}