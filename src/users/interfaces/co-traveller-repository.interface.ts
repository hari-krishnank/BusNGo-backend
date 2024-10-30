import { CreateCoTravellerDto } from '../dto/co-traveller.dto';
import { CoTraveller } from '../schemas/co-traveller.schema';

export interface ICoTravellerRepository {
    create(createCoTravellerDto: CreateCoTravellerDto): Promise<CoTraveller>;
    findAll(): Promise<CoTraveller[]>;
    findAllPaginated(userId: string, page: number, limit: number): Promise<{ coTravellers: CoTraveller[], total: number }>;
    findByUserId(userId: string): Promise<CoTraveller[]>;
    findById(id: string): Promise<CoTraveller>;
    update(id: string, updateCoTravellerDto: Partial<CreateCoTravellerDto>): Promise<CoTraveller>;
    delete(id: string): Promise<CoTraveller>;
}