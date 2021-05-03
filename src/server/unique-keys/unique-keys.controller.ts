import { Controller } from '@nestjs/common';
import { UniqueKeysService } from './unique-keys.service';

@Controller('unique-keys')
export class UniqueKeysController {
  constructor(private readonly uniqueKeysService: UniqueKeysService) {}
}
