import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { OwnerModule } from 'src/busOwner/owner.module';
import { OwnerJwtStrategy } from './strategies/ownerJwt.strategy';
import { AdminJwtStrategy } from './strategies/adminJwt.strategy';
import { UserAuthService } from './services/userAuth.service';
import { OwnerAuthService } from './services/ownerAuth.service';
import { UserAuthController } from './controllers/userAuth.controller';
import { OwnerAuthController } from './controllers/ownerAuth.controller';

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
    providers: [UserAuthService, OwnerAuthService, JwtStrategy, Logger, OwnerJwtStrategy, AdminJwtStrategy],
    controllers: [UserAuthController, OwnerAuthController]
})
export class AuthModule { }
