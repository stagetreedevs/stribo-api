import { Test, TestingModule } from '@nestjs/testing';
import { ReproductiveService } from './reproductive.service';

describe('ReproductiveService', () => {
  let service: ReproductiveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReproductiveService],
    }).compile();

    service = module.get<ReproductiveService>(ReproductiveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
