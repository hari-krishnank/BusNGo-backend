import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { OwnerModule } from 'src/busOwner/owner.module';
import { OwnerJwtStrategy } from './strategies/ownerJwt.strategy';
import { AdminJwtStrategy } from './strategies/adminJwt.strategy';

@Module({
    imports: [
        UsersModule,
        OwnerModule,
        ConfigModule.forRoot(),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '24h' },
            }),
            inject: [ConfigService]
        }),
    ],
    providers:[AuthService, JwtStrategy, Logger, OwnerJwtStrategy, AdminJwtStrategy],
    controllers:[AuthController]
})
export class AuthModule { }
