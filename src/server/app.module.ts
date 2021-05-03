import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ImagesModule } from './images/images.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { ViewModule } from './view/view.module';
import { ParameterModule } from './parameter/parameter.module';
import { UniqueKeysModule } from './unique-keys/unique-keys.module';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './auth/auth.middleware';
import { UsersController } from './users/users.controller';
import { ProductsController } from './products/products.controller';
import { ImagesController } from './images/images.controller';
import { ironSession } from 'next-iron-session';
import { AuthController } from './auth/auth.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MorganModule, MorganInterceptor } from 'nest-morgan';
import { PrismaService } from './prisma.service';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MorganModule,
    ImagesModule,
    EmailModule,
    UsersModule,
    ProductsModule,
    ViewModule,
    ParameterModule,
    UniqueKeysModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('combined'),
    },
    PrismaService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    const session = ironSession({
      password: process.env.APPLICATION_SECRET,
      cookieName: process.env.APPLICATION_COOKIE_NAME,
      cookieOptions: {
        // the next line allows to use the session in non-https environements
        secure: process.env.NODE_ENV === 'production',
      },
    });

    consumer
      .apply(session)
      .forRoutes(
        AuthController,
        UsersController,
        ProductsController,
        ImagesController,
      )
      .apply(AuthMiddleware)
      .forRoutes(UsersController, ProductsController, ImagesController);
  }
}
