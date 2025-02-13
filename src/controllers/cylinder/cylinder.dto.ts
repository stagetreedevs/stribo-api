import { ApiProperty } from '@nestjs/swagger';

export class CylinderDto {
  @ApiProperty()
  identifier: string;

  @ApiProperty()
  capacity: number;

  @ApiProperty({ required: false, default: '' })
  property: string;

  @ApiProperty({ required: false, default: '' })
  property_name: string;

  @ApiProperty({ required: false, default: 0 })
  stored: number;

  @ApiProperty({ required: false })
  animal_id: string;

  @ApiProperty({ required: false })
  animal_name: string;
}
