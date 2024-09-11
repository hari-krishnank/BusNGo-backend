import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ObjectCannedACL, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class AwsService {
    private s3Client: S3Client;

    constructor(private configService: ConfigService) {
        
        this.s3Client = new S3Client({
            region: this.configService.get<string>('aws.region'),
            credentials: {
                accessKeyId: this.configService.get('aws.accessKeyId'),
                secretAccessKey: this.configService.get('aws.secretAccessKey')
            }
        });
    }

    async uploadPublicFile(dataBuffer: Buffer, filename: string) {
        try {
            const uploadParams = {
                Bucket: this.configService.get('aws.bucketName'),
                Body: dataBuffer,
                Key: `${filename}`,
                ACL: 'public-read' as ObjectCannedACL,
                ContentDisposition: 'inline'
            };

            const command = new PutObjectCommand(uploadParams);
            const uploadResult = await this.s3Client.send(command);

            return {
                key: filename,
                url: `https://${uploadParams.Bucket}.s3.amazonaws.com/${filename}`
            };
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    }
}
