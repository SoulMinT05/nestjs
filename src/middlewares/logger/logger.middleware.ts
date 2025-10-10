import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

export interface IRequest {
  method: string;
  url: string;
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: IRequest, res: any, next: () => void) {
    const logger = new Logger('Request Logger Middleware');
    logger.log(`[${req.method} ${req.url}]`);
    next();
  }
}
