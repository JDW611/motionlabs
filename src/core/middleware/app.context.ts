import { InternalServerErrorException } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { EntityManager } from 'typeorm';

export interface AppContext {
    tid: string;
    entityManager?: EntityManager;
}

export const asyncLocalStorage = new AsyncLocalStorage<AppContext>();

export const getEntityManager = (): EntityManager => {
    const context = asyncLocalStorage.getStore();
    if (!context?.entityManager) {
        throw new InternalServerErrorException('EntityManager not found in context');
    }
    return context.entityManager;
};

export const getTid = (): string => {
    const context = asyncLocalStorage.getStore();
    if (!context?.tid) {
        throw new InternalServerErrorException('TID not found in context');
    }
    return context.tid;
};
