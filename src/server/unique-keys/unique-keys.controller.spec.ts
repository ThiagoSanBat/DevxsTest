import { Test, TestingModule } from '@nestjs/testing';
import { UniqueKeysController } from './unique-keys.controller';
import { UniqueKeysService } from './unique-keys.service';

describe('UniqueKeysController', () => {
  let controller: UniqueKeysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UniqueKeysController],
      providers: [UniqueKeysService],
    }).compile();

    controller = module.get<UniqueKeysController>(UniqueKeysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
