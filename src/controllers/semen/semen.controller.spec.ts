import { Test, TestingModule } from '@nestjs/testing';
import { SemenController } from './semen.controller';

describe('SemenController', () => {
  let controller: SemenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SemenController],
    }).compile();

    controller = module.get<SemenController>(SemenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
