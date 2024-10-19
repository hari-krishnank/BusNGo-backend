import { Injectable, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtAuthGuard } from "src/guards/jwtAuthGuard/jwt.guard";

@Injectable()
@UseGuards(JwtAuthGuard)
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET')
        }) 
    }

    async validate(payload: any) {
        console.log('Full payload received in userJwtStrategy:', JSON.stringify(payload, null, 2));
        if (payload.role !== 'user') {
            console.log('Invalid role detected. Expected "user", got:', payload.role);
            throw new UnauthorizedException('Invalid token for this resource');
        }
        return { userId: payload.sub, email: payload.email, role: payload.role };
    }
}