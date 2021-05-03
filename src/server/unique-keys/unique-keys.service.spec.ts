import { Test, TestingModule } from '@nestjs/testing';
import { UniqueKeysService } from './unique-keys.service';

describe('UniqueKeysService', () => {
  let service: UniqueKeysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UniqueKeysService],
    }).compile();

    service = module.get<UniqueKeysService>(UniqueKeysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
