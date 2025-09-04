/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceOrder } from './service-order.entity';
import { FilterDocumentsDto } from '../documents.dto';
@Injectable()
export class ServiceOrderService {
  constructor(
    @InjectRepository(ServiceOrder)
    private readonly orderRepository: Repository<ServiceOrder>,
  ) {}

  async create(body: any): Promise<any> {
    return await this.orderRepository.save(body);
  }

  async findByNumber(order_number: string): Promise<any> {
    return await this.orderRepository.findOne({ where: { order_number } });
  }

  async findByProperty(property: string): Promise<any> {
    return this.orderRepository.find({ where: { property } });
  }

  async findAll(): Promise<any> {
    return this.orderRepository.find();
  }

  async findFiltered(
    body: FilterDocumentsDto,
    property: string,
  ): Promise<any[]> {
    const queryBuilder =
      this.orderRepository.createQueryBuilder('service_order');

    if (body.initialDate) {
      queryBuilder.andWhere('service_order.date >= :initialDate', {
        initialDate: body.initialDate,
      });
    }

    if (body.lastDate) {
      queryBuilder.andWhere('service_order.date <= :lastDate', {
        lastDate: body.lastDate,
      });
    }

    // FILTRA PELA PROPRIEDADE
    if (property) {
      queryBuilder.andWhere('service_order.property = :property', {
        property: property,
      });
    }

    if (body.provider) {
      queryBuilder.andWhere('service_order.provider = :provider', {
        provider: body.provider,
      });
    }

    if (
      body.order &&
      (body.order.toUpperCase() === 'ASC' ||
        body.order.toUpperCase() === 'DESC')
    ) {
      queryBuilder.addOrderBy(
        'service_order.date',
        body.order as 'ASC' | 'DESC',
      );
    }

    return queryBuilder.getMany();
  }

  async update(order_number: string, body: any): Promise<any> {
    const verify = await this.findByNumber(order_number);

    if (!verify) {
      throw new HttpException(
        'Ordem de servico nao encontrado',
        HttpStatus.BAD_REQUEST,
      );
    }

    body.order_number = verify.order_number;
    body.property = verify.property;

    await this.orderRepository.update(order_number, body);
    return this.findByNumber(order_number);
  }

  async delete(order_number: string): Promise<void> {
    await this.orderRepository.delete(order_number);
  }
}
