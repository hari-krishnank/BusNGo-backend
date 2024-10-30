import { Injectable, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtAuthGuard } from "src/guards/jwtAuthGuard/jwt.guard";

@Injectable()
@UseGuards(JwtAuthGuard)
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
            signOptions: { expiresIn: '5m' }
        });
    }

    async validate(payload: any) {
        console.log('Full payload received in userJwtStrategy:', JSON.stringify(payload, null, 2));

        if (payload.role !== 'user') {
            console.log('Invalid role detected. Expected "user", got:', payload.role);
            throw new UnauthorizedException('Invalid token for this resource');
        }

        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
            throw new UnauthorizedException('Token has expired');
        }

        return { userId: payload.sub, email: payload.email, role: payload.role };
    }
}