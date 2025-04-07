import { Injectable } from '@nestjs/common';
import { ProductsEntity } from './entity/products.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsDTO, ProductsQueryDTO } from './dto/products.dto';
import { MovementsEntity } from './entity/movements.entity';
import { MovementsDTO } from './dto/movements.dto';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(ProductsEntity)
    private readonly productsRepository: Repository<ProductsEntity>,
    @InjectRepository(MovementsEntity)
    private readonly movementsRepository: Repository<MovementsEntity>,
  ) {}

  async createProduct(data: ProductsDTO) {
    const product = this.productsRepository.create(data);
    return await this.productsRepository.save(product);
  }

  async getAllProducts(query: ProductsQueryDTO) {
    const products = await this.productsRepository.find({
      where: {
        category: query.category || undefined,
        name: query.name || undefined,
        measurement_unit: query.measurement_unit || undefined,
      },
      order: {
        [query.order_by || 'name']: query.order === 'ASC' ? 'ASC' : 'DESC',
      },
    });

    return products.map((product) => {
      const quantity = product.movements.reduce((acc: number, movement) => {
        if (movement.type === 'IN') {
          return acc + Number(movement.quantity);
        } else {
          return acc - Number(movement.quantity);
        }
      }, 0);

      return {
        ...product,
        quantity,
      };
    });
  }

  async getProductById(id: string) {
    const product = await this.productsRepository.findOne({ where: { id } });

    if (!product) {
      return null;
    }

    const quantity = product.movements.reduce((acc: number, movement) => {
      if (movement.type === 'IN') {
        return acc + Number(movement.quantity);
      } else {
        return acc - Number(movement.quantity);
      }
    }, 0);

    return {
      ...product,
      quantity,
    };
  }

  async getAllProductsNames() {
    const products = await this.productsRepository.find({
      select: {
        name: true,
        id: true,
      },
    });

    return products.map((product) => ({
      label: product.name,
      value: product.id,
    }));
  }

  async updateProduct(id: string, data: Partial<ProductsDTO>) {
    return await this.productsRepository.save({
      id,
      ...data,
    });
  }

  async deleteProduct(id: string) {
    return await this.productsRepository.delete(id);
  }

  async createMovement(data: MovementsDTO) {
    const movement = this.movementsRepository.create({
      ...data,
      datetime: new Date(data.datetime),
      product: { id: data.product_id },
      animal: { id: data.animal_id },
    });
    return await this.movementsRepository.save(movement);
  }

  async getAllMovements() {
    return await this.movementsRepository.find({
      relations: {
        product: true,
        animal: true,
      },
    });
  }
}
