import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
    imports: [
        UsersModule,
        JwtModule.register({
            secret: 'Hari_Jwt',
            signOptions: { expiresIn: '1h' },
        }),
    ],
    providers:[AuthService],
    controllers:[AuthController]
})
export class AuthModule { }
