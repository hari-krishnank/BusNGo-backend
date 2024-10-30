import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/services/users.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { CreateGoogleUserDto } from 'src/users/dto/create-googleUser.dto';
import { UsersRepository } from 'src/users/repositories/users.repository';
import { IUserAuthService } from 'src/users/interfaces/user-auth-service.interface';

@Injectable()
export class UserAuthService implements IUserAuthService {
    private readonly logger = new Logger(UserAuthService.name);
    private googleClient: OAuth2Client;

    constructor(private userService: UsersService, private jwtService: JwtService, private configService: ConfigService, private userRepository: UsersRepository) {
        this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            this.logger.warn(`User not found for email: ${email}`);
            return null;
        }

        if (user.is_blocked) {
            throw new UnauthorizedException('Your account has been blocked. Please contact support.');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            this.logger.warn(`Invalid password for email: ${email}`);
            return null;
        }
        return {
            _id: user._id,
            email: user.email,
            username: user.username,
            is_blocked: user.is_blocked,
            phone: user.phone,
            profileImage: user.profileImage
        };
    }

    async generateTokens(user: any) {
        const payload = {
            email: user.email,
            sub: user._id.toString(),
            role: 'user',
            userId: user._id.toString()
        };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.sign(payload, {
                secret: this.configService.get<string>('JWT_SECRET'),
                expiresIn: '5m'
            }),
            this.jwtService.sign(payload, {
                secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
                expiresIn: '7d'
            })
        ]);

        await this.userRepository.updateRefreshToken(user._id.toString(), refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: {
                userId: user._id,
                email: user.email,
                username: user.firstName || user.username,
                phone: user.phone,
                profileImage: user.profileImage
            }
        };
    }

    async refreshTokens(refreshToken: string) {
        try {
            const payload = await this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>('REFRESH_TOKEN_SECRET')
            });

            const user = await this.userRepository.findById(payload.userId);
            if (!user || user.refreshToken !== refreshToken) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            return this.generateTokens(user);
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async login(user: any) {
        console.log('ithaan login cheyyunna user', user);

        if (!user || typeof user !== 'object' || !user.email || !user._id) {
            console.error('Invalid user object:', user);
            throw new Error('Invalid user object');
        }
        const payload = {
            email: user.email,
            sub: user._id.toString(),
            role: 'user',
            userId: user._id.toString()
        };
        console.log('Payload:', payload);
        return this.generateTokens(user);
    }

    async googleLogin(credential: string) {
        try {
            const ticket = await this.googleClient.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            console.log('Ithaan google login payload ticket', payload);

            const email = payload.email;

            if (!email) {
                throw new BadRequestException('Invalid Google Credential')
            }

            let user = await this.userService.findByEmail(email);
            if (!user) {
                const newUserData: CreateGoogleUserDto = {
                    email: payload.email,
                    username: payload.given_name,
                    lastName: payload.family_name,
                    phone: '',
                    profileImage: payload.picture || '',
                    is_verified: true,
                    is_blocked: false,
                    is_googleUser: true
                }

                user = await this.userRepository.create(newUserData)
                console.log('user vannu', user)
                this.logger.log(`New user created via Google login: ${email}`);
            } else {

                if (payload.picture && user.profileImage !== payload.picture) {
                    user = await this.userRepository.updateProfileImage(user._id as string, payload.picture);
                }
            }
            return this.login(user);
        } catch (error) {
            this.logger.error(`Google login error: ${error.message}`, error.stack);
            throw new UnauthorizedException('Failed to authenticate with Google');
        }
    }
}