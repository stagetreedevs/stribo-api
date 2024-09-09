import { Module } from '@nestjs/common';
import { CompetitionController } from './competition.controller';
import { CompetitionService } from './competition.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Competition } from './competition.entity';
import { AnimalModule } from '../animal/animal.module';

@Module({
  imports: [TypeOrmModule.forFeature([Competition]), AnimalModule],
  controllers: [CompetitionController],
  providers: [CompetitionService],
})
export class CompetitionModule {}
