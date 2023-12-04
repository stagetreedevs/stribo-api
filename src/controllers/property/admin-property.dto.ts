/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
export class AdminPropertyDto {
    @ApiProperty()
    adminId: string;
}