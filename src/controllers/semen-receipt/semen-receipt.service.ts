import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SemenReceipt } from './semen-receipt.entity';
import { Between, Repository } from 'typeorm';
import { AnimalService } from '../animal/animal.service';
import { FilterSemenReceiptDto, SemenReceiptDto } from './semen-receipt.dto';

export type ReturnSemenReceipt = {
  id: string;
  stallion_id: string;
  stallion_name: string;
  order_date: Date;
  amount_reeds: number;
  status: string;
  semen_type: string;
};

@Injectable()
export class SemenReceiptService {
  constructor(
    @InjectRepository(SemenReceipt)
    private readonly semenReceipt: Repository<SemenReceipt>,
    private readonly animalService: AnimalService,
  ) {}

  async create(body: SemenReceiptDto): Promise<SemenReceipt> {
    const stallion = await this.animalService.findOne(body.stallion_id);

    if (!stallion) {
      throw new ForbiddenException('Stallion not found');
    }

    if (body.mare_id) {
      const mare = await this.animalService.findOne(body.mare_id);

      if (!mare) {
        throw new ForbiddenException('Mare not found');
      }
    }

    return await this.semenReceipt.save(body);
  }

  async findById(id: string): Promise<SemenReceipt> {
    const semenReceipt = await this.semenReceipt.findOne({ where: { id } });

    if (!semenReceipt) {
      throw new NotFoundException('Semen receipt not found');
    }

    return semenReceipt;
  }

  async findAll(
    filter: FilterSemenReceiptDto | null,
    property: string | null = null,
  ): Promise<ReturnSemenReceipt[]> {
    if (filter) {
      const semenReceipt = await this.semenReceipt.find({
        where: {
          order_date:
            filter.start_date && filter.end_date
              ? Between(
                  new Date(filter.start_date.setHours(0, 0, 0, 0)),
                  new Date(filter.end_date.setHours(23, 59, 59, 999)),
                )
              : undefined,
          receiver: filter.receiver || undefined,
          semen_type: filter.semen_type || undefined,
          commercial_status: filter.commercial_status || undefined,
          status: filter.status || undefined,
          property: property || undefined,
        },
        order: { order_date: filter.order || 'DESC' },
      });

      const response: ReturnSemenReceipt[] = semenReceipt.map((item) => {
        return {
          id: item.id,
          stallion_id: item.stallion_id,
          stallion_name: item.stallion_name,
          order_date: item.order_date,
          amount_reeds: item.amount_reeds,
          status: item.status,
          semen_type: item.semen_type,
        };
      });

      return response;
    }

    const semenReceipt = await this.semenReceipt.find();
    return semenReceipt.map((item) => {
      return {
        id: item.id,
        stallion_id: item.stallion_id,
        stallion_name: item.stallion_name,
        order_date: item.order_date,
        amount_reeds: item.amount_reeds,
        status: item.status,
        semen_type: item.semen_type,
      };
    });
  }

  async getQuantity(property: string): Promise<number> {
    const semenReceipt = await this.semenReceipt.find({
      where: { property },
    });

    return semenReceipt.length;
  }

  async update(id: string, body: SemenReceiptDto): Promise<SemenReceipt> {
    const semenReceipt = await this.semenReceipt.findOne({ where: { id } });

    if (!semenReceipt) {
      throw new NotFoundException('Semen receipt not found');
    }

    return await this.semenReceipt.save({ ...semenReceipt, ...body });
  }

  async updateStatus(
    id: string,
    status: 'Não enviado' | 'Enviado' | 'Prenhez confirmada',
  ): Promise<SemenReceipt> {
    const semenReceipt = await this.semenReceipt.findOne({ where: { id } });

    if (!semenReceipt) {
      throw new NotFoundException('Semen receipt not found');
    }

    return await this.semenReceipt.save({ ...semenReceipt, status });
  }

  async updateCommercialStatus(
    id: string,
    commercial_status: 'Pedido confirmado' | 'Coleta Paga',
  ): Promise<SemenReceipt> {
    const semenReceipt = await this.semenReceipt.findOne({ where: { id } });

    if (!semenReceipt) {
      throw new NotFoundException('Semen receipt not found');
    }

    return await this.semenReceipt.save({ ...semenReceipt, commercial_status });
  }

  async delete(id: string): Promise<void> {
    const semenReceipt = await this.semenReceipt.findOne({ where: { id } });

    if (!semenReceipt) {
      throw new NotFoundException('Semen receipt not found');
    }

    await this.semenReceipt.delete({ id });
  }
}
