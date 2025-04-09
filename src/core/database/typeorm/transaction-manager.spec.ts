import { InternalServerErrorException } from '@nestjs/common';
import { TransactionManager } from './transaction-manager';
import { DataSource } from 'typeorm';
import { AppContext, asyncLocalStorage } from '@core/middleware/app.context';

describe('TransactionManager 테스트', () => {
    it('EntityManager가 없는 경우', () => {
        //given
        const manager = new TransactionManager();
        const context: AppContext = {
            tid: 'test-tid',
        };

        //when & then
        asyncLocalStorage.run(context, () => {
            expect(() => manager.getEntityManager()).toThrow(
                new InternalServerErrorException('EntityManager not found in context'),
            );
        });
    });

    it('정상작동', async () => {
        //given
        const manager = new TransactionManager();
        const dataSource = await new DataSource({
            type: 'sqlite',
            database: ':memory:',
        }).initialize();
        const em = dataSource.createEntityManager();

        const context: AppContext = {
            tid: 'test-tid',
            entityManager: em,
        };

        // when
        await asyncLocalStorage.run(context, async () => {
            const result = manager.getEntityManager();

            // then
            expect(result).toBe(em);
        });

        // cleanup
        await dataSource.destroy();
    });
});
