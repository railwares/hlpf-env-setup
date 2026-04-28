import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
 
export interface Response<T> {
  data: T;
  statusCode: number;
  timestamp: string;
}
 
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();
    
    if (request.url.includes('/api/docs')) {
      return next.handle();
    }

    // Цей блок обов'язково має бути перед return next.handle().pipe(...)
    const statusCode = context
      .switchToHttp()
      .getResponse().statusCode;

    return next.handle().pipe(
      map((data) => ({
        data,
        statusCode,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
