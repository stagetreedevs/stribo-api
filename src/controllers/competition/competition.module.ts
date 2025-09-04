import { Module } from '@nestjs/common';
import { CompetitionController } from './competition.controller';
import { CompetitionService } from './competition.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Competition } from './competition.entity';
import { AnimalModule } from '../animal/animal.module';
import { Competitor } from './competitor.entity';
import { OneSignalModule } from 'src/services/one-signal/one-signal.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Competition, Competitor]),
    AnimalModule,
    OneSignalModule,
  ],
  controllers: [CompetitionController],
  providers: [CompetitionService],
  exports: [CompetitionService],
})
export class CompetitionModule {}
