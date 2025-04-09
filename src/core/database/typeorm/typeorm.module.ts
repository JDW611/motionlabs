import { DynamicModule } from '@nestjs/common';
import { TypeOrmModule as OrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@config/services/config.service';
import * as path from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const entityPath = path.join(__dirname, '../../../domain/*/*.entity.{ts,js}');

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
                            type: 'mysql',
                            host: dbConfig.host,
                            port: dbConfig.port,
                            username: dbConfig.username,
                            password: dbConfig.password,
                            database: dbConfig.database,
                            synchronize: dbConfig.synchronize,
                            logging: dbConfig.logging,
                            entities: [entityPath],
                            namingStrategy: new SnakeNamingStrategy(),
                            extra: {
                                connectionLimit: 10,
                            },
                        };
                    },
                }),
            ],
        };
    }
}
