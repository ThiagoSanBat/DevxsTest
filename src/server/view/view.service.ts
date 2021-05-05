import { OnModuleInit } from '@nestjs/common';
import next, { NextServer } from 'next/dist/server/next';
import { AuthService } from '../auth/auth.service';

export class ViewService implements OnModuleInit {
  constructor(private readonly authService: AuthService) {}

  private server: NextServer;

  async onModuleInit() {
    try {
      this.server = next({
        dev: process.env.NODE_ENV !== 'production',
        dir: './src/client',
      });
      await this.server.prepare();
    } catch (error) {
      console.log(error);
    }
  }

  public verifyToken(token: string) {
    return this.authService.verify(token);
  }

  public get nextServer(): NextServer {
    return this.server;
  }
}
