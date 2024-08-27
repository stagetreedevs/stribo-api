import { Test, TestingModule } from '@nestjs/testing';
import { SemenService } from './semen.service';

describe('SemenService', () => {
  let service: SemenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SemenService],
    }).compile();

    service = module.get<SemenService>(SemenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
