import { Injectable } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

@Injectable()
export class SwaggerService {
    setup(app: INestApplication): void {
        const config = new DocumentBuilder()
            .setTitle('Motionlabs 과제테스트')
            .setDescription('과제테스트를 위한 간단한 api서버')
            .setVersion('1.0')
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
