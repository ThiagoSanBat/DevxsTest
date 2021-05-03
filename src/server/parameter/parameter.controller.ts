import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParameterService } from './parameter.service';
import { CreateParameterDto } from './dto/create-parameter.dto';
import { UpdateParameterDto } from './dto/update-parameter.dto';

@Controller('parameter')
export class ParameterController {
  constructor(private readonly parameterService: ParameterService) {}

  @Post()
  create(@Body() createParameterDto: CreateParameterDto) {
    return this.parameterService.create(createParameterDto);
  }

  @Get()
  findAll() {
    return this.parameterService.findAll();
  }

  @Get(':key')
  findOne(@Param('key') key: string) {
    return this.parameterService.findOne(key);
  }

  @Patch(':Key')
  update(@Param('key') key: string, @Body() updateParameterDto: UpdateParameterDto) {
    return this.parameterService.update(key, updateParameterDto);
  }

  @Delete(':key')
  remove(@Param('key') key: string) {
    return this.parameterService.remove(key);
  }
}
