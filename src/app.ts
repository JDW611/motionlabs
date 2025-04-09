import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerService } from '@config/services/swagger.service';
import { ConfigService } from '@config/services/config.service';
import { LoggerService } from '@core/services/logger.service';
import { ValidationPipe } from '@nestjs/common';
import { ClassValidatorExceptionFactory } from '@core/exceptions/class-validator/exception.factory';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const swaggerConfig = app.get(SwaggerService);
    const env = app.get(ConfigService);
    const logger = app.get(LoggerService);
    const exceptionFactory = new ClassValidatorExceptionFactory();

    app.useGlobalPipes(
        new ValidationPipe({ transform: true, exceptionFactory: exceptionFactory.throw() }),
    );

    swaggerConfig.setup(app);

    app.enableShutdownHooks();

    await app.listen(env.app.port, function appMain() {
        logger.log(`----------------------------------------------------------------------------`);
        logger.log(`🚀 App listening on the port ${env.app.port}`);
        logger.log(`============================================================================`);
    });
}
bootstrap();
