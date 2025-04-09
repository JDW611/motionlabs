import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ResponseEntity } from '@common/response';
@Injectable()
export class TransformInterceptor implements NestInterceptor {
    intercept(
        _context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            map(data => {
                if (data instanceof ResponseEntity) {
                    return data.toJSON();
                }

                return ResponseEntity.ok(data).toJSON();
            }),
        );
    }
}
