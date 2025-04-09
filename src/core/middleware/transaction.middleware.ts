import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { EntityManager } from 'typeorm';
import { AppContext, asyncLocalStorage } from './app.context';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TransactionMiddleware implements NestMiddleware {
    constructor(private readonly em: EntityManager) {}

    use(_req: Request, _res: Response, next: NextFunction) {
        const context: AppContext = {
            tid: uuidv4(),
            entityManager: this.em,
        };

        return asyncLocalStorage.run(context, next);
    }
}
