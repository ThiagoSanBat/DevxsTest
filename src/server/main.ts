import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ironSession, Session } from 'next-iron-session';
import { LoggedUser } from './auth/dto/logged-user.dto';

declare module 'express' {
  interface Request {
    session: Session;
    principal?: LoggedUser;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Dexs E-Commerce')
    .setDescription('The Dexs Api Description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
