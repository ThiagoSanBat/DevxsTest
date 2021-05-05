import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  UseGuards,
  Post,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { checkIsAdmin, Roles } from '../permissions/permissions.decorator';
import { Role } from '../permissions/permissions.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { EmailService } from '../email/email.service';
import { Request } from 'express';
import { User } from 'prisma/prisma-client';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(+id);
  }

  @Patch(':id')
  //@Roles(Role.Admin)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: Request,
  ) {
    const user = request.user;
    checkIsAdmin(user);
    return await this.usersService.update(+id, updateUserDto);
  }

  @Post()
  //@Roles(Role.Admin)
  async create(@Body() createUserDto: CreateUserDto, @Req() request: Request) {
    const user = request.user;
    checkIsAdmin(user);
    return await this.usersService.createUser(createUserDto, this.emailService);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() request: Request) {
    const user = request.user;
    checkIsAdmin(user);
    return await this.usersService.remove(+id);
  }
}
