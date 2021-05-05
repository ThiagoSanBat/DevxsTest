import { User } from '.prisma/client';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MorganInterceptor, MorganModule } from 'nest-morgan';
import { ironSession } from 'next-iron-session';
import { join } from 'path';

import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { ImagesModule } from './images/images.module';
import { ParameterModule } from './parameter/parameter.module';
import { RolesGuard } from './permissions/permissions.guard';
import { PrismaService } from './prisma.service';
import { ProductsModule } from './products/products.module';
import { UniqueKeysModule } from './unique-keys/unique-keys.module';
import { UsersModule } from './users/users.module';
import { ViewMiddleware } from './view/view.middleware';
import { ViewModule } from './view/view.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), process.env.STATIC_FOLDER),
      serveRoot: '/public',
    }),
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
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
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

    consumer.apply(ViewMiddleware).forRoutes({
      path: '/**',
      method: RequestMethod.ALL,
    });
  }
}
