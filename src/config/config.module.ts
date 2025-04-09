import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { SwaggerService } from './services/swagger.service';
import { ConfigService } from './services/config.service';
import { validate } from './validations/env.validation';

@Global()
@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV}`,
            validate,
        }),
    ],
    providers: [ConfigService, SwaggerService],
    exports: [ConfigService, SwaggerService],
})
export class ConfigModule {}
