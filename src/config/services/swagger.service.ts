import { Injectable } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

@Injectable()
export class SwaggerService {
    setup(app: INestApplication): void {
        const config = new DocumentBuilder()
            .setTitle('Your API Title')
            .setDescription('Your API description')
            .setVersion('1.0')
            .addTag('your-api-tag')
            .addBearerAuth()
            .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api-docs', app, document, {
            swaggerOptions: {
                persistAuthorization: true,
            },
        });
    }
}
