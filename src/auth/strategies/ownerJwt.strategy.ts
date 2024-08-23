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
            secretOrKey: configService.get<string>('JWT_SECRET')
        });
    }
    
    async validate(payload: any) {
        if (payload.role !== 'owner') {
            throw new UnauthorizedException('Invalid token for owner');
        }
        console.log('Owner JWT payload:', payload);
        return { ownerId: payload.sub, email: payload.email, role: payload.role };
    }
}