import { Inject } from '@nestjs/common';
import { GenericRepository } from '../generic/generic.repository';
import { RootEntity } from '../generic/root.entity';
import { TransactionManager } from './transaction-manager';
import { EntityTarget, FindOneOptions, Repository } from 'typeorm';

export abstract class GenericTypeOrmRepository<T extends RootEntity>
    implements GenericRepository<T>
{
    constructor(@Inject(TransactionManager) private readonly txManger: TransactionManager) {}

    abstract getName(): EntityTarget<T>;

    async save(t: T | T[]): Promise<T[]> {
        return this.getRepository().save(Array.isArray(t) ? t : [t]);
    }

    async findById(id: number): Promise<T | null> {
        const findOption: FindOneOptions = { where: { id } };
        return this.getRepository().findOne(findOption);
    }

    async remove(t: T | T[]): Promise<void> {
        await this.getRepository().remove(Array.isArray(t) ? t : [t]);
    }

    protected getRepository(): Repository<T> {
        return this.txManger.getEntityManager().getRepository(this.getName());
    }
}
