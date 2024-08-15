import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ReproductiveService } from './reproductive.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReproductiveDto } from './reproductive.dto';
import { Reproductive } from './reproductive.entity';

@ApiTags('REPRODUTIVO')
@ApiBearerAuth()
@Controller('reproductive')
export class ReproductiveController {
  constructor(private readonly reproductiveService: ReproductiveService) {}

  //@UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'CRIAR REPRODUTIVO' })
  @ApiBody({ type: ReproductiveDto })
  async create(@Body() body: Reproductive): Promise<Reproductive> {
    return this.reproductiveService.create(body);
  }
}
