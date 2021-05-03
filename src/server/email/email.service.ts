import { User } from '.prisma/client';
import { UniqueKey } from '.prisma/client';
import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EXPIRATION_DELTA } from '../parameter/constants';
import { ParameterService } from '../parameter/parameter.service';
import { UniqueKeysService } from '../unique-keys/unique-keys.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly userService: UsersService,
    private readonly mailerService: MailerService,
    private readonly uniqueKeyService: UniqueKeysService,
    private readonly parameterService: ParameterService,
    private readonly config: ConfigService,
  ) {}

  async sendVerifyEmail(user: User, uniqueKey: UniqueKey) {
    try {
      this.logger.log(
        `criação do user[${user.id}] unique key[${uniqueKey.id}]`,
      );
      this.mailerService
        .sendMail({
          to: user.email,
          subject: this.config.get<string>('EMAIL_VERIFY_SUBJECT'),
          template: process.cwd() + '/template/email_verify',
          context: {
            host: this.config.get<string>('URL_EMAIL_VERIFY'),
            uniqueKey: uniqueKey.id,
          },
        })
        .then((res) => this.logger.log(res))
        .catch((err) => this.logger.error(err));
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async validateUserEmail(uniqueKeyId: string) {
    const uniqueKey = await this.uniqueKeyService.findOne(uniqueKeyId);
    if (!uniqueKey)
      throw new HttpException(
        'Key not found',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    const isExpired = this.uniqueKeyService.isUniqueKeyExired(
      uniqueKey,
      +(await this.parameterService.findOne(EXPIRATION_DELTA)),
    );
    if (isExpired)
      throw new HttpException(
        'Expired token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return await this.userService.updateWithUniqueKey(uniqueKey.userId, {
      verified: true,
      uniqueKeys: {
        update: {
          where: { id: uniqueKey.id },
          data: { validatedAt: new Date() },
        },
      },
    });
  }

  async sendVerificationEmail(email: string) {
    const user = await this.userService.findByEmail(email);
    const uniqueKey = (await this.userService.uniqueKeyActive(user.id))
      .uniqueKeys[0];

    if (!user || !uniqueKey) {
      throw new HttpException(
        'Email not found',
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    this.sendVerifyEmail(user, uniqueKey);
  }
}
