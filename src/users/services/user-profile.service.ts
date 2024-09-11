import { Injectable, NotFoundException } from '@nestjs/common';
import { UserProfileRepository } from '../repositories/user-profile.repository';
import { AwsService } from 'src/aws/aws.service';

@Injectable()
export class UserProfileService {
    constructor(private readonly userProfileRepository: UserProfileRepository, private readonly awsService: AwsService) { }

    async getUserProfile(userId: string) {
        const user = await this.userProfileRepository.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return {
            username: user.username,
            email: user.email,
            lastName: user.lastName,
            phone: user.phone,
            profileImage: user.profileImage,
            is_googleUser: user.is_googleUser
        }
    }

    async updateProfilePhoto(userId: string, file: Express.Multer.File) {
        const user = await this.userProfileRepository.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const result = await this.awsService.uploadPublicFile(file.buffer, `profile-${userId}-${Date.now()}-${file.originalname}`);

        user.profileImage = result.url;
        console.log('ethi mwoneee', user.profileImage);
        
        user.profileImage = result.url;
        const updatedUser = await this.userProfileRepository.save(user);
        return { url: updatedUser.profileImage };
    }
}