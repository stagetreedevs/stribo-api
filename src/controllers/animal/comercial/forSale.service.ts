/* eslint-disable prettier/prettier */
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForSale } from './forSale.entity';
import { AnimalService } from '../animal.service';
import { FilterAnimalForSale } from './forSale.dto';
@Injectable()
export class ForSaleService {
  constructor(
    @InjectRepository(ForSale)
    private readonly saleRepository: Repository<ForSale>,
    @Inject(forwardRef(() => AnimalService))
    private readonly animalService: AnimalService,
  ) {}

  async create(body: any): Promise<any> {
    if (!body.animal) {
      throw new HttpException('Animal não selecionado', HttpStatus.BAD_REQUEST);
    }

    const verify = await this.findByAnimal(body.animal);
    if (verify) {
      throw new HttpException('Animal já está à venda', HttpStatus.BAD_REQUEST);
    }

    const animal = await this.animalService.findOne(body.animal);

    if (!animal) {
      throw new HttpException('ID inválido', HttpStatus.BAD_REQUEST);
    }

    const createBody = {
      animal_id: animal.id,
      animal_name: animal.name,
      animal_photo: animal.photo || '',
      animal_register: animal.registerNumber,
      property: animal.property,
      value: body.value,
      payment: true,
    };

    return await this.saleRepository.save(createBody);
  }

  async findAll(): Promise<any[]> {
    return this.saleRepository.find();
  }

  async findOne(id: string): Promise<any> {
    return await this.saleRepository.findOne({ where: { id } });
  }

  async findByAnimal(animal_id: string): Promise<any> {
    return await this.saleRepository.findOne({ where: { animal_id } });
  }

  async findByProperty(property: string): Promise<any[]> {
    return await this.saleRepository.find({ where: { property } });
  }

  async findByPropertyIndication(property: string): Promise<any[]> {
    const allAnimals = await this.findAll();

    const propertyAnimals = allAnimals.filter(
      (animal) => animal.property === property,
    );

    return propertyAnimals.map((animal) => ({
      ...animal,
      marketable: true,
    }));
  }

  async update(sale_id: string, body: any): Promise<any> {
    const animal = await this.findOne(sale_id);

    if (!animal) {
      throw new HttpException('Animal não encontrado', HttpStatus.BAD_REQUEST);
    }

    const { payment, installments } = body;

    // Verifica se payment é true(a vista) e installments não é nulo
    if (payment && installments !== null) {
      body.installments = null;
    }

    // Verifica se payment é false(parcelado) e installments é nulo ou tem menos de 1 item
    if (!payment && (installments === null || installments.length < 1)) {
      throw new HttpException(
        'Pagamento parcelado tem que ter no mínimo 2 itens.',
        HttpStatus.BAD_REQUEST,
      );
    }

    animal.value = body.value;
    animal.payment = body.payment;
    animal.installments = body.installments;

    await this.saleRepository.update(animal.id, animal);
    return await this.findOne(animal.id);
  }

  async remove(id: string, property_id: string): Promise<void> {
    const animal = await this.findOne(id);

    if (!animal) {
      throw new HttpException('Id inválido fornecido', HttpStatus.BAD_REQUEST);
    }

    if (animal.property === property_id) {
      await this.saleRepository.delete(id);
    } else {
      throw new HttpException(
        'Você não possui autorização para excluir este animal',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findFiltered(filterDto: FilterAnimalForSale): Promise<any[]> {
    const queryBuilder = this.saleRepository.createQueryBuilder('for_sale');

    if (filterDto.initialDate) {
      queryBuilder.andWhere('for_sale.date >= :initialDate', {
        initialDate: filterDto.initialDate,
      });
    }

    if (filterDto.lastDate) {
      queryBuilder.andWhere('for_sale.date <= :lastDate', {
        lastDate: filterDto.lastDate,
      });
    }

    if (
      filterDto.order &&
      (filterDto.order.toUpperCase() === 'ASC' ||
        filterDto.order.toUpperCase() === 'DESC')
    ) {
      queryBuilder.addOrderBy(
        'for_sale.date',
        filterDto.order as 'ASC' | 'DESC',
      );
    }

    return queryBuilder.getMany();
  }
}
