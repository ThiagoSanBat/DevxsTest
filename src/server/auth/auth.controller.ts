import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
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
    @Req() req: Request,
    @Body() login: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const accessToken = await this.authService.login(login);
      req.session.set('token', accessToken);
      await req.session.save();
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
  async logout(@Req() req: Request) {
    req.session.unset('token');
    await req.session.save();
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto, this.emailService);
  }
}
