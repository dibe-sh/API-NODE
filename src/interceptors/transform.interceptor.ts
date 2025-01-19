import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Prisma } from '@prisma/client';

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
        // Handle Prisma errors explicitly
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          // Map Prisma error codes to user-friendly messages
          const message = this.getPrismaErrorMessage(err);
          const errorResponse = {
            statusCode: 400, // Return 400 (Bad Request) for Prisma errors
            data: message,
          };
          return throwError(() => new HttpException(errorResponse, 400));
        }

        // For other errors, return generic error response
        const errorStatusCode =
          err instanceof HttpException ? err.getStatus() : 500;
        const errorResponse = {
          statusCode: errorStatusCode,
          data: 'An unexpected error occurred. Please try again later.',
        };
        return throwError(
          () => new HttpException(errorResponse, errorStatusCode),
        );
      }),
    );
  }

  /**
   * Maps Prisma error codes to user-friendly messages.
   */
  private getPrismaErrorMessage(
    err: Prisma.PrismaClientKnownRequestError,
  ): string {
    switch (err.code) {
      case 'P2002':
        return 'A unique constraint violation occurred. Please check your input.';
      case 'P2025':
        return 'The requested record was not found.';
      default:
        return 'A database error occurred. Please try again.';
    }
  }
}
