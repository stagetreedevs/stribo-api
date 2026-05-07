/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SupplierType {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ default: '' })
    description: string;

    @Column({ default: true })
    active: boolean;

    @Column({ type: 'timestamp', default: () => 'now()' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'now()' })
    updated_at: Date;
}
