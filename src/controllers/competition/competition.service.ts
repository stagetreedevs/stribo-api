import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { Competition } from './competition.entity';
import {
  CreateCompetitionDto,
  FilterCompetitionDto,
  UpdateAwardDto,
  UpdateCompetitionDto,
} from './competition.dto';
import { AnimalService } from '../animal/animal.service';

class CompetitionByAnimal extends Competition {
  animal_photo: string;
}

// TODO: Implement expenses

@Injectable()
export class CompetitionService {
  constructor(
    @InjectRepository(Competition)
    private competition: Repository<Competition>,
    private animalService: AnimalService,
  ) {}

  async create(data: CreateCompetitionDto): Promise<Competition> {
    return await this.competition.save(data);
  }

  async findAll(): Promise<Competition[]> {
    return await this.competition.find();
  }

  async findOne(id: string): Promise<Competition> {
    return await this.competition.findOne({ where: { id } });
  }

  async findByAnimal(animal_id: string): Promise<Competition[]> {
    return await this.competition.find({ where: { animal_id } });
  }

  async getAnalytics(property: string): Promise<any> {
    const competitions = await this.competition.find({ where: { property } });

    const expenses_total = 0;
    let prize_value_total = 0;
    let prize_quantity = 0;

    for (const competition of competitions) {
      if (competition.awarded) {
        prize_value_total += competition.prize_value;
        prize_quantity++;
      }
    }

    return {
      expenses_total,
      prize_value_total,
      prize_quantity,
    };
  }

  async getAnalyticsByAnimal(animal_id: string): Promise<any> {
    const competitions = await this.competition.find({ where: { animal_id } });

    const expenses_total = 0;
    let prize_value_total = 0;
    let prize_quantity = 0;

    for (const competition of competitions) {
      if (competition.awarded) {
        prize_value_total += competition.prize_value;
        prize_quantity++;
      }
    }

    return {
      expenses_total,
      prize_value_total,
      prize_quantity,
    };
  }

  async findCompetitions(property: string): Promise<any[]> {
    const competitions = await this.competition.find({ where: { property } });

    return competitions.map((competition) => {
      return {
        id: competition.id,
        date: competition.date,
        name: competition.name,
        modality: competition.modality,
        category: competition.category,
        animal_id: competition.animal_id,
        animal_name: competition.animal_name,
        animal_registry: competition.animal_registry,
      };
    });
  }

  async findCompetitionByAnimal(property: string): Promise<any[]> {
    const competitions = await this.competition.find({ where: { property } });

    const result: CompetitionByAnimal[] = [];

    for (const competition of competitions) {
      const animal = await this.animalService.findOne(competition.animal_id);
      const body = { ...competition, animal_photo: animal.photo };
      result.push(body);
    }

    return this.formattedCompetitionByAnimal(result);
  }

  async formattedCompetitionByAnimal(
    competitions: CompetitionByAnimal[],
  ): Promise<any[]> {
    const result: any[] = [];

    const competitionsByAnimal = {};

    for (const competition of competitions) {
      if (!competitionsByAnimal[competition.animal_id]) {
        competitionsByAnimal[competition.animal_id] = {
          animal_name: competition.animal_name,
          animal_photo: competition.animal_photo,
          animal_registry: competition.animal_registry,
          competitions: [],
        };
      }

      competitionsByAnimal[competition.animal_id].competitions.push({
        id: competition.id,
        date: competition.date,
        name: competition.name,
        modality: competition.modality,
        category: competition.category,
      });
    }

    for (const animal_id in competitionsByAnimal) {
      result.push(competitionsByAnimal[animal_id]);
    }

    return result;
  }

  async findAwardedCompetitions(property: string): Promise<any[]> {
    const competitions = await this.competition.find({
      where: { property },
    });

    return competitions
      .filter((competition) => competition.awarded)
      .map((competition) => {
        return {
          id: competition.id,
          date: competition.date,
          name: competition.name,
          animal_id: competition.animal_id,
          animal_name: competition.animal_name,
          animal_registry: competition.animal_registry,
          position: competition.position,
          prize_value: competition.prize_value,
          awarded: competition.awarded,
        };
      });
  }

  async findAwardedCompetitionsByAnimal(animal_id: string): Promise<any[]> {
    const competitions = await this.competition.find({
      where: { animal_id },
    });

    return competitions.map((competition) => {
      return {
        id: competition.id,
        date: competition.date,
        name: competition.name,
        animal_id: competition.animal_id,
        animal_name: competition.animal_name,
        animal_registry: competition.animal_registry,
        position: competition.position,
        prize_value: competition.prize_value,
        awarded: competition.awarded,
      };
    });
  }

  async filter(
    property: string,
    filter: FilterCompetitionDto,
  ): Promise<Competition[]> {
    return await this.competition.find({
      where: {
        property,
        date:
          filter.initialDate && filter.lastDate
            ? Between(
                new Date(filter.initialDate.setHours(0, 0, 0, 0)),
                new Date(filter.lastDate.setHours(23, 59, 59, 999)),
              )
            : filter.initialDate && !filter.lastDate
            ? MoreThanOrEqual(new Date(filter.initialDate.setHours(0, 0, 0, 0)))
            : filter.lastDate && !filter.initialDate
            ? MoreThan(new Date(filter.lastDate.setHours(23, 59, 59, 999)))
            : undefined,
        animal_id: filter.animal_id || undefined,
        modality: filter.modality || undefined,
        category: filter.category || undefined,
      },
      order: { date: filter.order || 'DESC' },
    });
  }

  async update(id: string, data: UpdateCompetitionDto): Promise<Competition> {
    const competition = await this.competition.findOne({ where: { id } });

    if (!competition) {
      throw new NotFoundException('Competition not found');
    }

    return await this.competition.save({ id: id, ...data });
  }

  async updateAwarded(id: string, data: UpdateAwardDto): Promise<Competition> {
    const competition = await this.competition.findOne({ where: { id } });

    if (!competition) {
      throw new NotFoundException('Competition not found');
    }

    return await this.competition.save({ id: id, ...data });
  }

  async delete(id: string): Promise<void> {
    const competition = await this.competition.findOne({ where: { id } });

    if (!competition) {
      throw new NotFoundException('Competition not found');
    }

    await this.competition.delete(id);
  }
}
