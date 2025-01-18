import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data) => ({
        statusCode,
        data,
      })),
      catchError((err) => {
        const errorStatusCode =
          err instanceof HttpException ? err.getStatus() : 500;
        const errorResponse = {
          statusCode: errorStatusCode,
          data: err?.response.data ?? err.message,
        };
        return throwError(
          () => new HttpException(errorResponse, errorStatusCode),
        );
      }),
    );
  }
}
