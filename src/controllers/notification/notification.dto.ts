/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
export class NotificationDto {
    @ApiProperty()
    user: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    message: string;

    @ApiProperty()
    hour: string;

    @ApiProperty()
    read: boolean;
}