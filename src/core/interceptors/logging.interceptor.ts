import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '@core/services/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private logger: LoggerService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url, body, headers } = request;
        const userAgent = headers['user-agent'] || '';
        const ip = request.ip;

        const startTime = Date.now();

        this.logger.log('Request received', {
            type: 'REQUEST',
            method,
            url,
            body,
            userAgent,
            ip,
        });

        return next.handle().pipe(
            tap({
                next: data => {
                    const responseTime = Date.now() - startTime;
                    this.logger.log('Request completed', {
                        type: 'RESPONSE',
                        method,
                        url,
                        responseTime,
                        response: data,
                    });
                },
                error: error => {
                    const responseTime = Date.now() - startTime;
                    this.logger.error('Request failed', error.stack, {
                        type: 'ERROR',
                        method,
                        url,
                        responseTime,
                        error: error.message,
                    });
                },
            }),
        );
    }
}
