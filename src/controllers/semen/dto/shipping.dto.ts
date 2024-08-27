import { ApiProperty } from '@nestjs/swagger';

export class SemenShippingDto {
  @ApiProperty()
  order_date: Date;

  @ApiProperty()
  stallion_property: string;

  @ApiProperty()
  client: string;

  @ApiProperty()
  stallion_id: string;

  @ApiProperty()
  stallion_name: string;

  @ApiProperty()
  semen_type: string;

  @ApiProperty({ required: false })
  mare_id: string;

  @ApiProperty({ required: false })
  mare_name: string;

  @ApiProperty()
  amount_reeds: number;

  @ApiProperty()
  carrier_name: string;

  @ApiProperty({ required: false })
  company: string;

  @ApiProperty()
  protocol: string;

  @ApiProperty({ required: false })
  observation: string;
}

export class FilterSemenShippingDto {
  @ApiProperty({ required: false })
  start_date?: Date;

  @ApiProperty({ required: false })
  end_date?: Date;

  @ApiProperty({ required: false })
  stallion_name?: string;

  @ApiProperty({ required: false })
  semen_type?: string;

  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  order?: 'ASC' | 'DESC';

  @ApiProperty({ required: false })
  commercial_status?: string;

  @ApiProperty({ required: false })
  status?: string;
}
