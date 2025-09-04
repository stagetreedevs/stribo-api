import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { Competition } from './competition.entity';
import {
  CreateCompetitionDto,
  FilterCompetitionDto,
  UpdateAwardDto,
  UpdateCompetitionDto,
} from './competition.dto';
import { AnimalService } from '../animal/animal.service';
import { Competitor } from './competitor.entity';
import { OneSignalService } from 'src/services/one-signal/one-signal.service';

class CompetitionByAnimal extends Competition {
  animal_photo: string;
}

// TODO: Implement expenses

@Injectable()
export class CompetitionService {
  constructor(
    @InjectRepository(Competition)
    private competition: Repository<Competition>,
    @InjectRepository(Competitor)
    private competitor: Repository<Competitor>,
    private animalService: AnimalService,
    private readonly oneSignalService: OneSignalService,
  ) {}

  private getNotificationDateTimeUTC(
    eventDate: Date,
    daysBefore: number,
    hourLocal: number,
    minuteLocal: number,
    timezoneOffsetHours = 3,
  ): Date | undefined {
    const targetDate = new Date(eventDate);
    targetDate.setUTCDate(targetDate.getUTCDate() - daysBefore);
    targetDate.setUTCHours(hourLocal + timezoneOffsetHours, minuteLocal, 0, 0);

    const nowUTC = new Date();
    return targetDate > nowUTC ? targetDate : undefined;
  }

  async create(data: CreateCompetitionDto): Promise<Competition> {
    const competitor = await this.competitor.findOne({
      where: { id: data.competitor },
    });

    const competition = await this.competition.save({
      ...data,
      competitor: competitor?.name || '',
      competitor_id: competitor?.id || '',
    });

    if (!competition) {
      throw new HttpException(
        'Erro ao criar competição',
        HttpStatus.BAD_REQUEST,
      );
    }

    const eventDate = new Date(competition.date);
    if (isNaN(eventDate.getTime())) {
      throw new HttpException(
        'Data da competição inválida.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const sendDateUTC = this.getNotificationDateTimeUTC(
      eventDate,
      2, // dias antes
      12, // hora local
      0, // minuto local
    );

    const displayDate = new Date(sendDateUTC || eventDate);
    const formattedDate = displayDate.toLocaleDateString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
    });
    const formattedTime = displayDate.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo',
    });

    await this.oneSignalService.sendNotification(
      competition.property,
      'Alerta de Competição',
      `A competição "${competition.name}" está agendada para ${formattedDate} às ${formattedTime}. Prepare-se!`,
      sendDateUTC?.toISOString(),
    );

    return competition;
  }

  async findAll(): Promise<Competition[]> {
    return await this.competition.find();
  }

  async findOne(id: string) {
    const competition = await this.competition.findOne({ where: { id } });

    const competitor = await this.competitor.findOne({
      where: { id: competition.competitor_id },
    });

    return {
      ...competition,
      competitor_data: competitor,
    };
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

  async findCompetitions(
    property: string,
    filter: FilterCompetitionDto,
  ): Promise<any[]> {
    const { search } = filter;

    const competitions = await this.competition.find({
      where: { property, name: search ? Like(`%${search}%`) : undefined },
    });

    return competitions.map((competition) => {
      return {
        id: competition.id,
        date: competition.date,
        name: competition.name,
        modality: competition.modality,
        competitor: competition.competitor,
        category: competition.category,
        animal_id: competition.animal_id,
        animal_name: competition.animal_name,
        animal_registry: competition.animal_registry,
      };
    });
  }

  async findCompetitionByAnimal(
    property: string,
    filter: FilterCompetitionDto,
  ): Promise<any[]> {
    const { search } = filter;

    const competitions = await this.competition.find({
      where: { property, name: search ? Like(`%${search}%`) : undefined },
    });

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
        competitor: competition.competitor,
        category: competition.category,
      });
    }

    for (const animal_id in competitionsByAnimal) {
      result.push(competitionsByAnimal[animal_id]);
    }

    return result;
  }

  async findAwardedCompetitions(
    property: string,
    filter: FilterCompetitionDto,
  ): Promise<any[]> {
    const { search } = filter;

    const competitions = await this.competition.find({
      where: { property, name: search ? Like(`%${search}%`) : undefined },
    });

    return competitions
      .filter((competition) => competition.awarded == 'Premiou')
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
        competitor: filter.competitor || undefined,
        city: filter.city || undefined,
        uf: filter.uf || undefined,
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

  async deleteAll(): Promise<void> {
    await this.competitor.delete({});
    await this.competition.delete({});
  }

  // * Competitor
  async createCompetitor(
    name: string,
    property_id: string,
  ): Promise<Competitor> {
    return await this.competitor.save({ name, property_id });
  }

  async findAllCompetitors(property_id: string): Promise<Competitor[]> {
    return await this.competitor.find({
      where: { property_id },
    });
  }

  async findNamesAllCompetitors(
    property_id?: string,
  ): Promise<{ label: string; value: string }[]> {
    const competitors = await this.competitor.find({
      where: { property_id: property_id || undefined },
    });

    return competitors.map((competitor) => {
      return {
        label: competitor.name,
        value: competitor.id,
      };
    });
  }

  async findNames(property_id?: string) {
    const competitions = await this.competition.find({
      where: { property: property_id || undefined },
      order: { name: 'ASC' },
    });

    return competitions.map((competition) => {
      return {
        label: competition.name,
        value: competition.id,
      };
    });
  }

  async findCompetitor(id: string): Promise<Competitor> {
    return await this.competitor.findOne({ where: { id } });
  }

  async updateCompetitor(id: string, name: string): Promise<Competitor> {
    const competitor = await this.competitor.findOne({ where: { id } });

    if (!competitor) {
      throw new NotFoundException('Competitor not found');
    }

    return await this.competitor.save({ id, name });
  }

  async deleteCompetitor(id: string): Promise<void> {
    const competitor = await this.competitor.findOne({ where: { id } });

    if (!competitor) {
      throw new NotFoundException('Competitor not found');
    }

    await this.competitor.delete(id);
  }
}
