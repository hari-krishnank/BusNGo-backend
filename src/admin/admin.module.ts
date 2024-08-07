import { Module } from '@nestjs/common';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { JwtAuthGuard } from 'src/guards/jwtAuthGuard/jwt.guard';
import { OwnerModule } from 'src/busOwner/owner.module';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    OwnerModule,
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService]
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, JwtStrategy, JwtAuthGuard]
})
export class AdminModule { }
