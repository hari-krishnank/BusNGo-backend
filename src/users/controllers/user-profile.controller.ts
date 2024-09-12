import { Controller, Get, UseGuards, Request, UseInterceptors, Post, UploadedFile, Put, Body } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwtAuthGuard/jwt.guard';
import { UserProfileService } from '../services/user-profile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserProfileDto } from '../dto/updateUserProfile.dto';

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
    @Put()
    async updateUserProfile(@Request() req, @Body() updateUserProfileDto: UpdateUserProfileDto) {
        const userId = req.user.userId;
        return this.userProfileService.updateUserProfile(userId, updateUserProfileDto);
    }

    @UseGuards(JwtAuthGuard)
    @Post('update-photo')
    @UseInterceptors(FileInterceptor('image'))
    async updateProfilePhoto(@Request() req, @UploadedFile() file: Express.Multer.File) {
        const userId = req.user.userId;
        return this.userProfileService.updateProfilePhoto(userId, file);
    }
}