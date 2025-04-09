import { DynamicModule } from '@nestjs/common';
import { TypeOrmModule as OrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@config/services/config.service';
import * as path from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const entityPath = path.join(__dirname, '../../../entities/*/*.entity.js');
const migrationPath = path.join(__dirname, '../../../migrations/*.js');

export class TypeOrmModule {
    static forRoot(): DynamicModule {
        return {
            module: TypeOrmModule,
            imports: [
                OrmModule.forRootAsync({
                    inject: [ConfigService],
                    useFactory: (configService: ConfigService) => {
                        const dbConfig = configService.getDatabaseConfig();

                        return {
                            type: 'postgres',
                            host: dbConfig.host,
                            port: dbConfig.port,
                            username: dbConfig.username,
                            password: dbConfig.password,
                            database: dbConfig.database,
                            synchronize: dbConfig.synchronize,
                            logging: dbConfig.logging,
                            entities: [entityPath],
                            namingStrategy: new SnakeNamingStrategy(),
                            migrationsTableName: 'migrations',
                            migrationsRun: true,
                            migrations: [migrationPath],
                            migrationsTransactionMode: 'all',
                            extra: {
                                max: 5,
                            },
                        };
                    },
                }),
            ],
        };
    }
}
