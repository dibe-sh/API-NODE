import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../logger/winston.config';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestId = Math.random().toString(36).substring(7);
    req['requestId'] = requestId;

    logger.info('Incoming request', {
      requestId,
      method: req.method,
      url: req.url,
      query: req.query,
      body: req.body,
    });

    // Log response
    const originalSend = res.send;
    res.send = function (body) {
      logger.info('Outgoing response', {
        requestId,
        statusCode: res.statusCode,
        body: body,
      });
      return originalSend.call(this, body);
    };

    next();
  }
}
