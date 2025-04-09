import { getTid } from '@core/middleware/app.context';
import { Injectable } from '@nestjs/common';
import path from 'path';
import { Logger as TypeOrmLogger } from 'typeorm';
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

@Injectable()
export class LoggerService implements TypeOrmLogger {
    private logger;

    constructor() {
        const nodeEnv = process.env.NODE_ENV;
        const isLocalEnv = ['local', 'dev', undefined].includes(nodeEnv);
        const level = isLocalEnv ? 'debug' : 'info';

        this.logger = createLogger({
            level,
            transports: [
                new DailyRotateFile({
                    filename: path.join(process.cwd(), 'logs', 'app-%DATE%.log'),
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d',
                    format: this.getJsonFormat(),
                }),
                new transports.Console({
                    format: this.getTextFormat(),
                }),
            ],
        });
    }

    private getTextFormat() {
        return format.combine(
            format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss',
            }),
            format.ms(),
            format.prettyPrint(),
        );
    }

    private getJsonFormat() {
        return format.combine(
            format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss',
            }),
            format.ms(),
            format.json(),
        );
    }

    private addContext(context?: any) {
        try {
            const tid = getTid();
            return { ...context, tid };
        } catch {
            return context;
        }
    }
    log(message: string, context?: any) {
        this.logger.info(message, this.addContext(context));
    }

    error(message: string, trace: string, context?: any) {
        this.logger.error(message, { trace, ...this.addContext(context) });
    }

    warn(message: string, context?: any) {
        this.logger.warn(message, this.addContext(context));
    }

    debug(message: string, context?: any) {
        this.logger.debug(message, this.addContext(context));
    }

    logQuery(query: string, parameters?: any[]): void {
        this.debug('Database query', { type: 'DB_QUERY', query, parameters });
    }

    logQueryError(error: string | Error, query: string, parameters?: any[]): void {
        this.error('Database query error', error instanceof Error ? error.stack : error, {
            type: 'DB_QUERY_ERROR',
            query,
            parameters,
        });
    }

    logQuerySlow(time: number, query: string, parameters?: any[]): void {
        this.warn('Slow query detected', {
            type: 'DB_SLOW_QUERY',
            executionTime: time,
            query,
            parameters,
        });
    }

    logMigration(message: string): void {
        this.log(message, { type: 'DB_MIGRATION' });
    }

    logSchemaBuild(message: string): void {
        this.log(message, { type: 'DB_SCHEMA' });
    }
}
