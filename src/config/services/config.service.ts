import { AppConfig, Config, DatabaseConfig } from '@config/interfaces/config.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
    constructor(private configService: NestConfigService<Config, true>) {}

    get database(): DatabaseConfig {
        return this.configService.get('database', { infer: true });
    }

    get app(): AppConfig {
        return this.configService.get('app', { infer: true });
    }

    getDatabaseConfig(): DatabaseConfig {
        const config = this.database;
        if (!config) {
            throw new Error('데이터베이스 설정을 찾을 수 없습니다.');
        }
        return config;
    }

    getAppConfig(): AppConfig {
        const config = this.app;
        if (!config) {
            throw new Error('애플리케이션 설정을 찾을 수 없습니다.');
        }
        return config;
    }
}
