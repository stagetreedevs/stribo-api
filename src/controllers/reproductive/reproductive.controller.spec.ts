import { Test, TestingModule } from '@nestjs/testing';
import { ReproductiveController } from './reproductive.controller';

describe('ReproductiveController', () => {
  let controller: ReproductiveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReproductiveController],
    }).compile();

    controller = module.get<ReproductiveController>(ReproductiveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
