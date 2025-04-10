import { Environment } from '@common/enums/environment.enum';

export interface DatabaseConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    synchronize: boolean;
}

export interface AppConfig {
    port: number;
    environment: Environment;
}

export interface Config {
    database: DatabaseConfig;
    app: AppConfig;
}
