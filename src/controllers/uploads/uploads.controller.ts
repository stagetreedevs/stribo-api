/* eslint-disable prettier/prettier */
import {
    Controller,
    Post,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    PayloadTooLargeException,
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

const MAX_FILE_SIZE = 25 * 1024 * 1024;

const sanitizeFileName = (name: string): string => {
    if (!name) return `arquivo-${Date.now()}`;
    const lastDot = name.lastIndexOf('.');
    const base = (lastDot > 0 ? name.slice(0, lastDot) : name) || 'arquivo';
    const ext = lastDot > 0 ? name.slice(lastDot).toLowerCase() : '';
    const normalizedBase = base
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9._-]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^[-.]+|[-.]+$/g, '')
        .slice(0, 80) || 'arquivo';
    const normalizedExt = ext.replace(/[^a-zA-Z0-9.]/g, '');
    return `${Date.now()}-${normalizedBase}${normalizedExt}`;
};

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
    @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_FILE_SIZE } }))
    async upload(
        @UploadedFile() file: Express.Multer.File,
        @Body('folder') folder?: string,
    ): Promise<{ url: string }> {
        if (!file) {
            throw new BadRequestException('Arquivo é obrigatório');
        }
        if (file.size > MAX_FILE_SIZE) {
            throw new PayloadTooLargeException('Arquivo excede o limite de 25MB');
        }

        const safeFolder = (folder && folder.trim() !== '' ? folder : 'attachments')
            .replace(/[^a-zA-Z0-9_\-/]/g, '')
            .replace(/^\/+|\/+$/g, '') || 'attachments';

        const fileForS3: any = {
            ...file,
            buffer: file.buffer,
            originalname: sanitizeFileName(file.originalname),
        };

        const url = await this.s3Service.upload(fileForS3, safeFolder);
        return { url };
    }
}
