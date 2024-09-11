import { Controller, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AwsService } from './aws.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('image-upload')
export class AwsController {
    constructor(private awsService: AwsService) { }

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Req() request,
        @Res() response
    ) {
        try {
            const result = await this.awsService.uploadPublicFile(file.buffer, file.originalname);
            return response.status(200).json(result);
        } catch (error) {
            return response
                .status(500)
                .json(`Failed to upload image file: ${error.message}`);
        }
    }
}
