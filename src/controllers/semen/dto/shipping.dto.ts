import { ApiProperty } from '@nestjs/swagger';

export class SemenShippingDto {
  @ApiProperty()
  order_date: Date;

  @ApiProperty()
  shipping_date: Date;

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

  @ApiProperty({ required: false, enum: ['Pedido confirmado', 'Coleta Paga'] })
  commercial_status?: 'Pedido confirmado' | 'Coleta Paga';

  @ApiProperty({
    required: false,
    enum: ['Não enviado', 'Enviado', 'Prenhez confirmada'],
  })
  status?: 'Não enviado' | 'Enviado' | 'Prenhez confirmada';
}

export class UpdateCommercialStatusDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: ['Pedido confirmado', 'Coleta Paga'] })
  status: 'Pedido confirmado' | 'Coleta Paga';
}

export class UpdateStatusDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: ['Não enviado', 'Enviado', 'Prenhez confirmada'] })
  status: 'Não enviado' | 'Enviado' | 'Prenhez confirmada';
}
