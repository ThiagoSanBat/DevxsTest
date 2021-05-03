import { MailerModule } from '@nestjs-modules/mailer';
import { forwardRef, Module } from '@nestjs/common';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';
import { EmailController } from './email.controller';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { UniqueKeysModule } from '../unique-keys/unique-keys.module';
import { ParameterModule } from '../parameter/parameter.module';
import { UniqueKeysService } from '../unique-keys/unique-keys.service';
import { ParameterService } from '../parameter/parameter.service';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [
    UsersModule,
    UniqueKeysModule,
    ParameterModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: +process.env.EMAIL_PORT,
        secure: false, // upgrade later with STARTTLS
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
      defaults: {
        from: process.env.EMAIL_FROM,
      },
      template: {
        dir: process.cwd() + '/template/',
        adapter: new HandlebarsAdapter(), // or new PugAdapter()
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [
    EmailService,
    ConfigService,
    UsersService,
    UniqueKeysService,
    ParameterService,
    PrismaService,
  ],
  exports: [EmailService],
  controllers: [EmailController],
})
export class EmailModule {}
