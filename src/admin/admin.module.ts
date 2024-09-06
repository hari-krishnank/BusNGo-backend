import { Module } from '@nestjs/common';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { OwnerModule } from 'src/busOwner/owner.module';
import { AdminJwtAuthGuard } from 'src/guards/jwtAuthGuard/adminJwt.guard';
import { AdminJwtStrategy } from 'src/auth/strategies/adminJwt.strategy';

@Module({
  imports: [
    UsersModule,
    OwnerModule,
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.adminSecret'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService]
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminJwtAuthGuard, AdminJwtStrategy]
})
export class AdminModule { }
