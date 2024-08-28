import { ApiProperty } from '@nestjs/swagger';

export class SemenReceiptDto {
  @ApiProperty()
  order_date: Date;

  @ApiProperty()
  receipt_date: Date;

  @ApiProperty()
  receiver: string;

  @ApiProperty()
  stallion_id: string;

  @ApiProperty()
  stallion_name: string;

  @ApiProperty()
  mare_id: string;

  @ApiProperty()
  mare_name: string;

  @ApiProperty()
  semen_type: string;

  @ApiProperty()
  amount_reeds: number;

  @ApiProperty({ required: false })
  departure_number: string;

  @ApiProperty()
  protocol: string;

  @ApiProperty()
  carrier_name: string;

  @ApiProperty({ required: false })
  company: string;

  @ApiProperty({ required: false })
  observation: string;

  @ApiProperty({ enum: ['Pedido confirmado', 'Coleta Paga'] })
  commercial_status: 'Pedido confirmado' | 'Coleta Paga';

  @ApiProperty({ enum: ['Não enviado', 'Enviado', 'Prenhez confirmada'] })
  status: 'Não enviado' | 'Enviado' | 'Prenhez confirmada';
}

export class FilterSemenReceiptDto {
  @ApiProperty({ required: false })
  start_date?: Date;

  @ApiProperty({ required: false })
  end_date?: Date;

  @ApiProperty({ required: false })
  receiver?: string;

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
