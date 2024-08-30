import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class SemenReceipt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  property: string;

  @Column({ type: 'timestamp', default: () => 'now()' })
  order_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  receipt_date: Date;

  @Column()
  receiver: string;

  @Column()
  stallion_id: string;

  @Column()
  stallion_name: string;

  @Column()
  mare_id: string;

  @Column()
  mare_name: string;

  @Column()
  semen_type: string;

  @Column()
  amount_reeds: number;

  @Column({ nullable: true })
  departure_number: string;

  @Column()
  protocol: string;

  @Column()
  carrier_name: string;

  @Column({ nullable: true })
  company: string;

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
    receipt_date: Date,
    receiver: string,
    stallion_id: string,
    stallion_name: string,
    property: string,
    mare_id: string,
    mare_name: string,
    semen_type: string,
    amount_reeds: number,
    departure_number: string,
    protocol: string,
    carrier_name: string,
    company: string,
    observation: string,
    commercial_status: 'Pedido confirmado' | 'Coleta Paga',
    status: 'Não enviado' | 'Enviado' | 'Prenhez confirmada',
  ) {
    this.id = uuidv4();
    this.order_date = order_date;
    this.receipt_date = receipt_date;
    this.receiver = receiver;
    this.stallion_id = stallion_id;
    this.property = property;
    this.stallion_name = stallion_name;
    this.mare_id = mare_id;
    this.mare_name = mare_name;
    this.semen_type = semen_type;
    this.amount_reeds = amount_reeds;
    this.departure_number = departure_number;
    this.protocol = protocol;
    this.carrier_name = carrier_name;
    this.company = company;
    this.observation = observation;
    this.commercial_status = commercial_status;
    this.status = status;
  }
}
