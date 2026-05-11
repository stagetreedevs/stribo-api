/* eslint-disable prettier/prettier */
import {
    Controller,
    Post,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    Body,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { S3Service } from '../s3/s3.service';

class UploadFileDto {
    folder?: string;
    file?: any;
}

@ApiTags('UPLOADS')
@ApiBearerAuth()
@Controller('uploads')
export class UploadsController {
    constructor(private readonly s3Service: S3Service) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'Sobe um arquivo genérico para o S3 e devolve a URL' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: UploadFileDto })
    @UseInterceptors(FileInterceptor('file'))
    async upload(
        @UploadedFile() file: Express.Multer.File,
        @Body('folder') folder?: string,
    ): Promise<{ url: string }> {
        if (!file) {
            throw new BadRequestException('Arquivo é obrigatório');
        }
        const safeFolder = (folder && folder.trim() !== '' ? folder : 'attachments').replace(/[^a-zA-Z0-9_\-/]/g, '');
        const url = await this.s3Service.upload(file, safeFolder);
        return { url };
    }
}
