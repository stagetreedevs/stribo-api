import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SemenShipping } from './entity/shipping.entity';
import { Between, Repository } from 'typeorm';
import { AnimalService } from '../animal/animal.service';
import { FilterSemenShippingDto } from './dto/shipping.dto';

export type ReturnSemenShipping = {
  id: string;
  client: string;
  amount_reeds: number;
  semen_type: string;
  order_date: Date;
  status: string;
};

@Injectable()
export class SemenService {
  constructor(
    @InjectRepository(SemenShipping)
    private readonly semenShipping: Repository<SemenShipping>,
    private readonly animalService: AnimalService,
  ) {}

  async create(body: SemenShipping): Promise<SemenShipping> {
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

    return await this.semenShipping.save(body);
  }

  async findById(id: string): Promise<SemenShipping> {
    const semenShipping = await this.semenShipping.findOne({ where: { id } });

    if (!semenShipping) {
      throw new NotFoundException('Semen shipping not found');
    }

    return semenShipping;
  }

  async findAll(filter: FilterSemenShippingDto | null): Promise<{
    semenShipping: ReturnSemenShipping[];
    total: number;
    shipped: number;
    requested: number;
  }> {
    if (filter) {
      const semenShipping = await this.semenShipping.find({
        where: {
          order_date:
            filter.start_date && filter.end_date
              ? Between(
                  new Date(filter.start_date.setHours(0, 0, 0, 0)),
                  new Date(filter.end_date.setHours(23, 59, 59, 999)),
                )
              : undefined,
          stallion_name: filter.stallion_name || undefined,
          semen_type: filter.semen_type || undefined,
          commercial_status: filter.commercial_status || undefined,
          status: filter.status || undefined,
        },
        order: { order_date: filter.order || 'DESC' },
      });

      const total = semenShipping.length;

      const shipped = semenShipping.filter(
        (semen) => semen.status == 'Enviado',
      ).length;

      const requested = semenShipping.filter(
        (semen) => semen.status != 'Enviado',
      ).length;

      const response: ReturnSemenShipping[] = semenShipping.map((semen) => ({
        id: semen.id,
        client: semen.client,
        amount_reeds: semen.amount_reeds,
        semen_type: semen.semen_type,
        order_date: semen.order_date,
        status: semen.status,
      }));

      return {
        semenShipping: response,
        total,
        shipped,
        requested,
      };
    }
    const semenShipping = await this.semenShipping.find({
      order: { order_date: 'DESC' },
    });

    const total = semenShipping.length;

    const shipped = semenShipping.filter(
      (semen) => semen.status == 'Enviado',
    ).length;

    const requested = semenShipping.filter(
      (semen) => semen.status != 'Enviado',
    ).length;

    const response: ReturnSemenShipping[] = semenShipping.map((semen) => ({
      id: semen.id,
      client: semen.client,
      amount_reeds: semen.amount_reeds,
      semen_type: semen.semen_type,
      order_date: semen.order_date,
      status: semen.status,
    }));

    return {
      semenShipping: response,
      total,
      shipped,
      requested,
    };
  }

  async update(id: string, body: SemenShipping): Promise<SemenShipping> {
    const semenShipping = await this.semenShipping.findOne({ where: { id } });

    if (!semenShipping) {
      throw new NotFoundException('Semen shipping not found');
    }

    return await this.semenShipping.save({ ...semenShipping, ...body });
  }

  async updateStatus(
    id: string,
    status: 'Não enviado' | 'Enviado' | 'Prenhez confirmada',
  ): Promise<SemenShipping> {
    const semenShipping = await this.semenShipping.findOne({ where: { id } });

    if (!semenShipping) {
      throw new NotFoundException('Semen shipping not found');
    }

    const now = new Date();

    return await this.semenShipping.save({
      ...semenShipping,
      status,
      shipping_date: status == 'Enviado' ? now : null,
    });
  }

  async updateCommercialStatus(
    id: string,
    commercialStatus: 'Pedido confirmado' | 'Coleta Paga',
  ): Promise<SemenShipping> {
    const semenShipping = await this.semenShipping.findOne({ where: { id } });

    if (!semenShipping) {
      throw new NotFoundException('Semen shipping not found');
    }

    return await this.semenShipping.save({
      ...semenShipping,
      commercial_status: commercialStatus,
    });
  }

  async delete(id: string): Promise<void> {
    const semenShipping = await this.semenShipping.findOne({ where: { id } });

    if (!semenShipping) {
      throw new NotFoundException('Semen shipping not found');
    }

    await this.semenShipping.delete(id);
  }
}
