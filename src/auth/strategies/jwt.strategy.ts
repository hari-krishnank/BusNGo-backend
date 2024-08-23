import { Injectable, UseGuards } from "@nestjs/common";
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
        console.log('JWT payload:', payload);
        return { userId: payload.sub, email: payload.email, role: payload.role };
    }
}