import { Module } from '@nestjs/common';
import { CompetitionController } from './competition.controller';
import { CompetitionService } from './competition.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Competition } from './competition.entity';
import { AnimalModule } from '../animal/animal.module';
import { Competitor } from './competitor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Competition, Competitor]), AnimalModule],
  controllers: [CompetitionController],
  providers: [CompetitionService],
  exports: [CompetitionService],
})
export class CompetitionModule {}
