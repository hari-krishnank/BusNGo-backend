import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class StaffJwtStrategy extends PassportStrategy(Strategy, 'staff-jwt') {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_STAFF_SECRET')
        });
    }

    async validate(payload: any) {
        console.log('Full payload received in OwnerJwtStrategy:', JSON.stringify(payload, null, 2));
        if (payload.role !== 'staff') {
            console.log('Invalid role detected. Expected "staff", got:', payload.role);
            throw new UnauthorizedException('Invalid token for this resource');
        }
        console.log('Staff JWT payload:', payload);
        return { staffId: payload.sub, email: payload.email, role: payload.role };
    }
}