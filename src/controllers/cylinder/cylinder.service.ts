import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cylinder } from './cylinder.entity';
import { Repository } from 'typeorm';
import { AnimalService } from '../animal/animal.service';
import { PropertyService } from '../property/property.service';
import { CylinderDto } from './cylinder.dto';

@Injectable()
export class CylinderService {
  constructor(
    @InjectRepository(Cylinder) private readonly cylinder: Repository<Cylinder>,
    private readonly animalService: AnimalService,
    private readonly propertyService: PropertyService,
  ) {}

  async create(data: CylinderDto): Promise<Cylinder> {
    if (!data.identifier) {
      throw new Error('Identifier is required');
    }

    const cylinderExists = await this.cylinder.findOne({
      where: { identifier: data.identifier },
    });

    if (cylinderExists) {
      throw new Error('Cylinder already exists');
    }

    const { property_id, animal_id } = data;
    if (property_id) {
      const property = await this.propertyService.findOne(property_id);

      if (!property) {
        throw new Error('Property not found');
      }

      data.property_name = property.name;
    }

    if (animal_id) {
      const animal = await this.animalService.findOne(animal_id);

      if (!animal) {
        throw new Error('Animal not found');
      }

      data.animal_name = animal.name;
    }

    return await this.cylinder.save(data);
  }

  async findAll(property: string | null = null) {
    return await this.cylinder.find({
      where: {
        property: property || undefined,
      },
    });
  }

  async findById(id: string): Promise<Cylinder> {
    const cylinder = await this.cylinder.findOne({ where: { id } });

    if (!cylinder) {
      throw new Error('Cylinder not found');
    }

    return cylinder;
  }

  async update(id: string, data: CylinderDto): Promise<Cylinder> {
    const cylinder = await this.cylinder.findOne({ where: { id } });

    if (data.animal_id) {
      const animal = await this.animalService.findOne(data.animal_id);

      if (!animal) {
        throw new Error('Animal not found');
      }

      data.animal_name = animal.name;
    }

    if (data.property_id) {
      const property = await this.propertyService.findOne(data.property_id);

      if (!property) {
        throw new Error('Property not found');
      }

      data.property_name = property.name;
    }

    if (!cylinder) {
      throw new Error('Cylinder not found');
    }

    return await this.cylinder.save({ ...cylinder, ...data });
  }

  async updateStored(id: string, stored: number): Promise<Cylinder> {
    const cylinder = await this.cylinder.findOne({ where: { id } });

    if (!cylinder) {
      throw new Error('Cylinder not found');
    }

    return await this.cylinder.save({ ...cylinder, stored });
  }

  async delete(id: string): Promise<void> {
    const cylinder = await this.cylinder.findOne({ where: { id } });

    if (!cylinder) {
      throw new Error('Cylinder not found');
    }

    await this.cylinder.delete(cylinder);
  }
}
