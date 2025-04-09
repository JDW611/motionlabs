import { getEntityManager } from '@core/middleware/app.context';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class TransactionManager {
    getEntityManager(): EntityManager {
        return getEntityManager();
    }
}
