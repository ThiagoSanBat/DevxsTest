import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { EmailService } from '../email/email.service';
import { UserNotVerifiedException } from '../exceptions';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() login: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const accessToken = await this.authService.login(login);
      res.status(HttpStatus.OK);
      return { accessToken };
    } catch (e) {
      if (e instanceof UserNotVerifiedException) {
        res.status(HttpStatus.BAD_REQUEST);
        return e;
      }
      throw e;
    }
  }

  @Post('signout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto, this.emailService);
  }
}
