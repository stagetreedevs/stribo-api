import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SemenFrozen } from './semen-frozen.entity';
import { Between, Repository } from 'typeorm';
import { AnimalService } from '../animal/animal.service';
import { CylinderService } from '../cylinder/cylinder.service';
import { FilterSemenFrozen, SemenFrozenDto } from './semen-frozen.dto';

type SemenFrozenInfo = {
  collection_date: Date;
  animal_id: string;
  animal_name: string;
  number_reeds: number;
  animal_registry: string;
  status: string;
};

type AnimalSemenFrozen = {
  animal_id: string;
  animal_name: string;
  animal_photo: string;
  animal_registry: string;
  semensFrozen: SemenFrozenInfo[];
};

@Injectable()
export class SemenFrozenService {
  constructor(
    @InjectRepository(SemenFrozen)
    private readonly semenFrozen: Repository<SemenFrozen>,
    private readonly animalService: AnimalService,
    private readonly cylinderService: CylinderService,
  ) {}

  async create(body: SemenFrozenDto): Promise<SemenFrozen> {
    const animal = await this.animalService.findOne(body.animal_id);
    const cylinder = await this.cylinderService.findById(body.cylinder_id);

    if (!animal) {
      throw new ForbiddenException('Animal not found');
    }

    if (!cylinder) {
      throw new ForbiddenException('Cylinder not found');
    }

    if (cylinder.stored + body.number_reeds > cylinder.capacity) {
      throw new ForbiddenException(
        `${cylinder.capacity - cylinder.stored} reeds available`,
      );
    }

    const cylinderUpdated = await this.cylinderService.updateStored(
      body.cylinder_id,
      body.number_reeds + cylinder.stored,
    );

    if (!cylinderUpdated) {
      throw new ForbiddenException('Error updating cylinder');
    }

    body.animal_name = animal.name;

    return await this.semenFrozen.save({
      ...body,
      match_number: String(new Date().getTime()),
    });
  }

  async findById(id: string): Promise<SemenFrozen> {
    return await this.semenFrozen.findOne({ where: { id } });
  }

  async getStock(property: string | null = null): Promise<number> {
    const storages = await this.semenFrozen.find({
      where: {
        property: property || undefined,
      },
    });
    return storages.reduce((acc, storage) => acc + storage.number_reeds, 0);
  }

  async getQuantity(property: string): Promise<number> {
    const semenFrozen = await this.semenFrozen.find({
      where: { property },
    });

    let amount_reeds = 0;

    semenFrozen.forEach((semen) => {
      amount_reeds += semen.number_reeds;
    });

    return amount_reeds;
  }

  async findAll(
    filter: FilterSemenFrozen | null,
    property: string | null = null,
  ): Promise<SemenFrozenInfo[] | AnimalSemenFrozen[]> {
    let storages: SemenFrozen[] | SemenFrozenInfo[] =
      await this.semenFrozen.find({
        where: {
          collection_date:
            filter.start_date && filter.end_date
              ? Between(
                  new Date(filter.start_date.setHours(0, 0, 0, 0)),
                  new Date(filter.end_date.setHours(23, 59, 59, 999)),
                )
              : undefined,
          cylinder_id: filter.cylinder_id,
          property: property || filter.property || undefined,
        },
        order: { collection_date: filter.order || 'DESC' },
      });

    if (storages.length === 0) {
      return [];
    }

    storages = storages.map((storage: SemenFrozen) => {
      return {
        id: storage.id,
        collection_date: storage.collection_date,
        animal_id: storage.animal_id,
        animal_registry: storage.animal_registry,
        animal_name: storage.animal_name,
        number_reeds: storage.number_reeds,
        status: storage.status,
      };
    });

    if (filter.layout === 'storages' || filter.layout == null) {
      return storages;
    }

    const animals = await this.animalService.findAll();

    const animalsWithSemenFrozen: AnimalSemenFrozen[] = animals.map(
      (animal) => {
        const animalSemensFrozen = storages.filter(
          (storage) => storage.animal_id === animal.id,
        );

        if (animalSemensFrozen.length === 0) {
          return;
        }

        return {
          animal_id: animal.id,
          animal_name: animal.name,
          animal_photo: animal.photo,
          animal_registry: animal.registerNumber,
          semensFrozen: animalSemensFrozen,
        };
      },
    );

    return animalsWithSemenFrozen.filter((animal) => animal !== undefined);
  }

  async update(id: string, body: SemenFrozenDto): Promise<SemenFrozen> {
    const storage = await this.semenFrozen.findOne({ where: { id } });
    const cylinder = await this.cylinderService.findById(body.cylinder_id);

    if (!storage) {
      throw new ForbiddenException('Storage not found');
    }

    if (!cylinder) {
      throw new ForbiddenException('Cylinder not found');
    }

    if (cylinder.stored + body.number_reeds > cylinder.capacity) {
      throw new ForbiddenException(
        `${cylinder.capacity - cylinder.stored} reeds available`,
      );
    }

    const cylinderUpdated = await this.cylinderService.updateStored(
      body.cylinder_id,
      body.number_reeds + cylinder.stored,
    );

    if (!cylinderUpdated) {
      throw new ForbiddenException('Error updating cylinder');
    }

    if (body.animal_id) {
      const animal = await this.animalService.findOne(body.animal_id);

      if (!animal) {
        throw new ForbiddenException('Animal not found');
      }

      body.animal_name = animal.name;
    }

    if (body.cylinder_id) {
      const cylinder = await this.cylinderService.findById(body.cylinder_id);

      if (!cylinder) {
        throw new ForbiddenException('Cylinder not found');
      }

      body.cylinder_identifier = cylinder.identifier;
    }

    return await this.semenFrozen.save({ ...storage, ...body });
  }

  async updateStatus(
    id: string,
    status: 'Não enviado' | 'Enviado' | 'Prenhez confirmada',
  ): Promise<SemenFrozen> {
    const semenShipping = await this.semenFrozen.findOne({ where: { id } });

    if (!semenShipping) {
      throw new NotFoundException('Semen shipping not found');
    }

    const now = new Date();

    return await this.semenFrozen.save({
      ...semenShipping,
      status,
      shipping_date: status == 'Enviado' ? now : null,
    });
  }

  async delete(id: string): Promise<void> {
    const storage = await this.semenFrozen.findOne({ where: { id } });

    if (!storage) {
      throw new ForbiddenException('Storage not found');
    }

    await this.semenFrozen.delete(storage.id);
  }
}
