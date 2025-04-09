import { GenericRepository } from '../generic/generic.repository';
import { RootEntity } from '../generic/root.entity';
import { FindOneOptions, Repository } from 'typeorm';

export abstract class GenericTypeOrmRepository<T extends RootEntity>
    implements GenericRepository<T>
{
    constructor(protected readonly repository: Repository<T>) {}

    protected getRepository(): Repository<T> {
        return this.repository;
    }

    async save(t: T): Promise<T>;
    async save(t: T[]): Promise<T[]>;
    async save(t: T | T[]): Promise<T | T[]> {
        const result = await this.repository.save(Array.isArray(t) ? t : [t]);
        return Array.isArray(t) ? result : result[0];
    }

    async findById(id: number): Promise<T | null> {
        const findOption: FindOneOptions = { where: { id } };
        return this.repository.findOne(findOption);
    }

    async remove(t: T | T[]): Promise<void> {
        await this.repository.remove(Array.isArray(t) ? t : [t]);
    }
}
