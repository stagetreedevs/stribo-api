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

    return await this.cylinder.save(data);
  }

  async findAll(property?: string) {
    const cylinders = await this.cylinder.find();

    return cylinders.filter((cylinder) => {
      if (property) {
        return cylinder.property === property || !cylinder.property;
      }

      return true;
    });
  }

  async getQuantity(property: string): Promise<number> {
    let cylinders = await this.cylinder.find();

    cylinders = cylinders.filter((cylinder) => {
      if (property) {
        return cylinder.property === property || !cylinder.property;
      }

      return true;
    });

    return cylinders.length;
  }

  async findAllNames() {
    const cylinders = await this.cylinder.find({
      select: {
        identifier: true,
        id: true,
      },
    });

    return cylinders.map((cylinder) => ({
      label: cylinder.identifier,
      value: cylinder.id,
    }));
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
