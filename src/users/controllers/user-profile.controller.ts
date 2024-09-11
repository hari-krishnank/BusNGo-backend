import { Controller, Get, UseGuards, Request, UseInterceptors, Post, UploadedFile } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwtAuthGuard/jwt.guard';
import { UserProfileService } from '../services/user-profile.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user-profile')
export class UserProfileController {
    constructor(private readonly userProfileService: UserProfileService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getUserProfile(@Request() req) {
        const userId = req.user.userId;
        return this.userProfileService.getUserProfile(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('update-photo')
    @UseInterceptors(FileInterceptor('image'))
    async updateProfilePhoto(@Request() req, @UploadedFile() file: Express.Multer.File) {
        const userId = req.user.userId;
        return this.userProfileService.updateProfilePhoto(userId, file);
    }
}