import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class OwnerJwtStrategy extends PassportStrategy(Strategy, 'owner-jwt') {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_OWNER_SECRET')
        });
    }

    async validate(payload: any) {
        console.log('Full payload received in OwnerJwtStrategy:', JSON.stringify(payload, null, 2));
        if (payload.role !== 'owner') {
            console.log('Invalid role detected. Expected "owner", got:', payload.role);
            throw new UnauthorizedException('Invalid token for this resource');
        }
        console.log('Owner JWT payload:', payload);
        return { ownerId: payload.sub, email: payload.email, role: payload.role };
    }
}