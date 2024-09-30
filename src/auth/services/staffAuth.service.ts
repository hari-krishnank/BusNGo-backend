import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { IStaffAuthService } from "src/busOwner/interfaces/staff-auth-service.interface";
import { StaffService } from "src/busOwner/services/staff.service";

@Injectable()
export class StaffAuthService implements IStaffAuthService {
    private readonly logger = new Logger(StaffAuthService.name);

    constructor(private jwtService: JwtService, private staffService: StaffService, private configService: ConfigService) { }

    async validateStaff(username: string, password: string) {
        return this.staffService.validateStaff(username, password);
    }

    async loginStaff(staff: any) {
        if (!staff || typeof staff !== 'object' || !staff.email || !staff._id) {
            console.error('Invalid staff object:', staff);
            throw new Error('Invalid staff object');
        }
        const payload = { email: staff.email, sub: staff._id, role: 'staff' };
        console.log('payload of the staff login', payload);

        return {
            access_token: this.jwtService.sign(payload, { secret: this.configService.get<string>('JWT_STAFF_SECRET') }),
        };
    }
}