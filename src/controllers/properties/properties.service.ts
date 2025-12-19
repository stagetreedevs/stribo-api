import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsEntity } from './entity/products.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThan, MoreThan, Repository } from 'typeorm';
import { ProductsDTO, ProductsQueryDTO } from './dto/products.dto';
import { MovementsEntity } from './entity/movements.entity';
import { MovementsDTO, MovementsQueryDTO } from './dto/movements.dto';

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

  async getAllProducts(query: ProductsQueryDTO, property_id?: string) {
    const products = await this.productsRepository.find({
      where: {
        property_id: property_id || undefined,
        category: query.category || undefined,
        name: query.name || undefined,
        measurement_unit: query.measurement_unit || undefined,
      },
      order: {
        [query.order_by || 'name']: query.order === 'ASC' ? 'ASC' : 'DESC',
      },
      relations: {
        movements: true,
      },
    });

    if (!products.length) {
      return [];
    }

    return products.map((product) => {
      if (!product.movements) {
        return {
          ...product,
          quantity: 0,
        };
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
    });
  }

  async getProductsByPropertyId(property_id: string) {
    console.log(`Buscando produtos para property_id: ${property_id}`);

    const products = await this.productsRepository.find({
      where: { property_id },
      relations: ['movements'],
      order: { created_at: 'DESC' },
    });

    if (!products || products.length === 0) {
      throw new NotFoundException(
        `Nenhum produto encontrado para a propriedade com ID: ${property_id}`,
      );
    }

    console.log(`Encontrados ${products.length} produtos`);
    return products;
  }

  async getProductById(id: string) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: {
        movements: true,
      },
    });

    if (!product) {
      return null;
    }

    if (!product.movements) {
      return {
        ...product,
        quantity: 0,
      };
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

  async getAllProductsNames(property_id?: string) {
    const products = await this.productsRepository.find({
      where: {
        property_id: property_id || undefined,
      },
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

  async getProductNamesByPropertyId(property_id: string) {
    console.log(`Buscando nomes de produtos para property_id: ${property_id}`);

    const products = await this.productsRepository.find({
      where: { property_id },
      select: ['id', 'name', 'category', 'measurement_unit'],
      order: { name: 'ASC' },
    });

    if (!products || products.length === 0) {
      throw new NotFoundException(
        `Nenhum produto encontrado para a propriedade com ID: ${property_id}`,
      );
    }

    console.log(`Encontrados ${products.length} produtos`);

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      measurement_unit: product.measurement_unit,
    }));
  }

  async updateProduct(id: string, data: ProductsDTO) {
    return await this.productsRepository.save({
      id,
      ...data,
    });
  }

  async deleteProduct(id: string) {
    return await this.productsRepository.delete(id);
  }

  async createMovement(data: MovementsDTO) {
    const movementData: any = {
      ...data,
      datetime: new Date(data.datetime),
      product: { id: data.product_id },
    };

    if (data.animal_id && data.animal_id.trim() !== '') {
      movementData.animal = { id: data.animal_id };
    }

    const movement = this.movementsRepository.create(movementData);
    return await this.movementsRepository.save(movement);
  }

  async getAllMovements(query: MovementsQueryDTO, property_id?: string) {
    return await this.movementsRepository.find({
      where: {
        datetime:
          query.start_date && query.end_date
            ? Between(query.start_date, query.end_date)
            : query.start_date
            ? MoreThan(query.start_date)
            : query.end_date
            ? LessThan(query.end_date)
            : undefined,
        type: query.type || undefined,
        property_id: property_id || undefined,
        product: query.category ? { category: query.category } : undefined,
        quantity:
          query.start_quantity && query.end_quantity
            ? Between(query.start_quantity, query.end_quantity)
            : query.start_quantity
            ? MoreThan(query.start_quantity)
            : query.end_quantity
            ? LessThan(query.end_quantity)
            : undefined,
      },
      order: {
        [query.order_by || 'datetime']: query.order === 'ASC' ? 'ASC' : 'DESC',
      },
      relations: {
        product: true,
        animal: true,
      },
    });
  }

  async getMovementsByPropertyId(property_id: string) {
    console.log(`Buscando movimentações para property_id: ${property_id}`);

    const movements = await this.movementsRepository.find({
      where: { property_id },
      order: { datetime: 'DESC' },
      relations: ['product', 'animal'],
    });

    if (!movements || movements.length === 0) {
      throw new NotFoundException(
        `Nenhuma movimentação encontrada para a propriedade com ID: ${property_id}`,
      );
    }

    console.log(`Encontradas ${movements.length} movimentações`);
    return movements;
  }

  async getMovementById(id: string) {
    return await this.movementsRepository.findOne({
      where: { id },
      relations: {
        product: true,
        animal: true,
      },
    });
  }

  async updateMovement(id: string, data: MovementsDTO) {
    const movementData: any = {
      id,
      ...data,
      product: { id: data.product_id },
      datetime: new Date(data.datetime),
    };

    if (data.animal_id && data.animal_id.trim() !== '') {
      movementData.animal = { id: data.animal_id };
    } else {
      movementData.animal = null;
    }

    return await this.movementsRepository.save(movementData);
  }

  async deleteMovement(id: string) {
    return await this.movementsRepository.delete(id);
  }
}
