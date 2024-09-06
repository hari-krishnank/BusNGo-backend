import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_ADMIN_SECRET')
        });
    }

    async validate(payload: any) {
        console.log('Full payload received in AdminJwtStrategy:', JSON.stringify(payload, null, 2));
        if (!payload.isAdmin || payload.role !== 'admin') {
            console.log('Invalid role detected. Expected "admin", got:', payload.role);
            throw new UnauthorizedException('Invalid token for admin');
        }
        console.log('Admin JWT payload:', payload);
        return { userId: payload.sub, email: payload.email, role: payload.role, isAdmin: payload.isAdmin };
    }
}