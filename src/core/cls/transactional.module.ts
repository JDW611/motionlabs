import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from 'express';
import { ClsModule } from 'nestjs-cls';
import { DataSource } from 'typeorm';
import { v4 as uuid } from 'uuid';

export class TransactionalModule {
    static forRoot(): DynamicModule {
        return ClsModule.forRoot({
            global: true,
            middleware: {
                mount: true,
                generateId: true,
                idGenerator: (req: Request) => req.header('x-request-id') ?? uuid(),
            },
            plugins: [
                new ClsPluginTransactional({
                    imports: [TypeOrmModule],
                    adapter: new TransactionalAdapterTypeOrm({
                        dataSourceToken: DataSource,
                    }),
                }),
            ],
        });
    }
}
