import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log('Middleware');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    req.user = 'Soul';
    next();
  }
}
