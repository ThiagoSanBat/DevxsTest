import { NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { resolve, join } from 'path';

const pathToStaticFolder = process.cwd();
const resolvePath = (file: string) => resolve(`${pathToStaticFolder}/${file}`);

export class ViewMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const { baseUrl } = req;
    if (baseUrl.indexOf('public') > 0) {
      res.sendFile(resolve(resolvePath(baseUrl)));
    } else {
      next();
    }
  }
}
