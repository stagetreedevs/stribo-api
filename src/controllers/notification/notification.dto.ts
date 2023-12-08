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
    animal: string;

    @ApiProperty()
    operator: string;

    @ApiProperty()
    category: string;

    @ApiProperty()
    subCategory: string;

    @ApiProperty()
    read: boolean;
}

export class FilterNotificationDto {
    @ApiProperty()
    order?: string;

    @ApiProperty({ required: false })
    initialDate?: Date;

    @ApiProperty({ required: false })
    lastDate?: Date;

    @ApiProperty({ required: false })
    animal?: string;

    @ApiProperty({ required: false })
    operator?: string;

    @ApiProperty({ required: false })
    category?: string;

    @ApiProperty({ required: false })
    subCategory?: string;
}
