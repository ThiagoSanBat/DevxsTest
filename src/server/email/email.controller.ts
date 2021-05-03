import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@ApiTags('email')
@Controller('email')
export class EmailController {
  private readonly logger = new Logger(EmailController.name);

  constructor(private readonly emailService: EmailService) {}

  @Get('checked/:key')
  @HttpCode(HttpStatus.PERMANENT_REDIRECT)
  async emailChecked(@Param('key') key: string, @Res() res: Response) {
    this.logger.log(`verificando ${key}`);
    try {
      await this.emailService.validateUserEmail(key);
      res.status(HttpStatus.OK);
      res.redirect('/email/verified');
    } catch (err) {
      this.logger.error(err);
      res.status(HttpStatus.BAD_REQUEST);
      res.redirect('/email/expired');
    }
  }

  @Post('retrieve-email')
  async sendVerificationEmail(@Body() createUserDto: CreateUserDto) {
    return await this.emailService.sendVerificationEmail(createUserDto.email);
  }
}
