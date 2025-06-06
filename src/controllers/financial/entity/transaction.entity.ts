import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BankAccount } from './bank-account.entity';
import { Category } from './category.entity';
import { Installment } from './installment.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Period } from '../dto/transaction.dto';

export class ExtraField {
  @ApiProperty()
  label: string;

  @ApiProperty()
  value: string | number;

  @ApiProperty()
  id?: string;
}

export enum CommissionType {
  FIXED = 'fixed',
  PERCENTAGE = 'percentage',
}

export enum TransactionType {
  REVENUE = 'revenue',
  EXPENSE = 'expense',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  datetime: Date;

  @Column({ enum: TransactionType })
  type: TransactionType;

  @Column()
  property_id: string;

  @Column()
  description: string;

  @ManyToOne(() => BankAccount, (bankAccount) => bankAccount.transactions)
  bankAccount: BankAccount;

  @ManyToOne(() => Category, (category) => category.transactions, {
    nullable: true,
  })
  category: Category;

  @Column({ type: 'jsonb', nullable: true })
  extra_fields: ExtraField[];

  @Column()
  original_value: number;

  @Column({ enum: CommissionType, nullable: true, default: null })
  commission_type: CommissionType;

  @Column({ nullable: true, default: null })
  commission_value: number;

  @Column({ nullable: true, default: null })
  beneficiary_name: string;

  @Column({ nullable: true, default: null, enum: Period })
  period: Period;

  @Column({ type: 'boolean', default: false })
  is_periodically: boolean;

  @OneToMany(() => Installment, (installment) => installment.transaction, {
    nullable: true,
  })
  installments: Installment[];

  @Column({ nullable: true })
  contract_file: string;

  @Column({ nullable: true })
  invoice_file: string;

  @Column({ nullable: true })
  receipt_file: string;

  @Column({ nullable: true, type: 'simple-array' })
  attachments_files: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export enum FilterPeriodDate {
  TODAY = 'today',
  SEVEN_DAYS = 'seven_days',
  THIRTY_DAYS = 'thirty_days',
}

export class QueryTransaction {
  @ApiProperty({ enum: FilterPeriodDate, required: false })
  period_date?: FilterPeriodDate;

  @ApiProperty({ required: false })
  start_date?: Date;

  @ApiProperty({ required: false })
  end_date?: Date;

  @ApiProperty({ required: false })
  bank_account_id?: string;

  @ApiProperty({ required: false })
  category_id?: string;

  @ApiProperty({ required: false })
  type?: TransactionType;

  @ApiProperty({ required: false })
  property_id?: string;
}

export interface TOfxData {
  OFX: {
    SIGNONMSGSRSV1: {
      SONRS: {
        STATUS: {
          CODE: string;
          SEVERITY: string;
        };
        DTSERVER: string;
        LANGUAGE: string;
        FI: {
          ORG: string;
          FID: string;
        };
      };
    };
    BANKMSGSRSV1: {
      STMTTRNRS: {
        TRNUID: string;
        STATUS: {
          CODE: string;
          SEVERITY: string;
        };
        STMTRS: {
          CURDEF: string;
          BANKACCTFROM: {
            BANKID: string;
            BRANCHID: string;
            ACCTID: string;
            ACCTTYPE: string;
          };
          BANKTRANLIST: {
            DTSTART: string;
            DTEND: string;
            STMTTRN: {
              TRNTYPE: string;
              DTPOSTED: string;
              TRNAMT: string;
              FITID: string;
              MEMO: string;
            }[];
          };
          LEDGERBAL: {
            BALAMT: string;
            DTASOF: string;
          };
        };
      };
    };
  };
  header: {
    OFXHEADER: string;
    DATA: string;
    VERSION: string;
    ENCODING: string;
    CHARSET: string;
    COMPRESSION: string;
    SECURITY: string;
    BANKID: string;
    CURRENCY: string;
  };
}
