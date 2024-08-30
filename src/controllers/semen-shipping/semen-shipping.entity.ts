import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class SemenShipping {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'now()' })
  order_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  shipping_date: Date;

  @Column({ default: '' })
  property: string;

  @Column()
  stallion_property: string;

  @Column()
  client: string;

  @Column()
  stallion_id: string;

  @Column()
  stallion_name: string;

  @Column()
  semen_type: string;

  @Column({ nullable: true })
  mare_id: string;

  @Column({ nullable: true })
  mare_name: string;

  @Column()
  amount_reeds: number;

  @Column()
  carrier_name: string;

  @Column({ nullable: true })
  company: string;

  @Column()
  protocol: string;

  @Column({ nullable: true })
  observation: string;

  @Column({
    enum: ['Pedido confirmado', 'Coleta Paga'],
    default: 'Pedido confirmado',
  })
  commercial_status: 'Pedido confirmado' | 'Coleta Paga';

  @Column({
    enum: ['Não enviado', 'Enviado', 'Prenhez confirmada'],
    default: 'Não enviado',
  })
  status: 'Não enviado' | 'Enviado' | 'Prenhez confirmada';

  constructor(
    order_date: Date,
    shipping_date: Date,
    stallion_property: string,
    client: string,
    stallion_id: string,
    stallion_name: string,
    property: string,
    semen_type: string,
    mare_id: string,
    mare_name: string,
    amount_reeds: number,
    carrier_name: string,
    company: string,
    protocol: string,
    observation: string,
    commercial_status: 'Pedido confirmado' | 'Coleta Paga',
    status: 'Não enviado' | 'Enviado' | 'Prenhez confirmada',
  ) {
    this.id = uuidv4();
    this.order_date = order_date;
    this.shipping_date = shipping_date;
    this.stallion_property = stallion_property;
    this.client = client;
    this.stallion_id = stallion_id;
    property = property;
    this.stallion_name = stallion_name;
    this.semen_type = semen_type;
    this.mare_id = mare_id;
    this.mare_name = mare_name;
    this.amount_reeds = amount_reeds;
    this.carrier_name = carrier_name;
    this.company = company;
    this.protocol = protocol;
    this.observation = observation;
    this.commercial_status = commercial_status;
    this.status = status;
  }
}
