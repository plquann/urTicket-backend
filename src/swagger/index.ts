import { Logger, INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  SWAGGER_API_ROOT,
  SWAGGER_API_NAME,
  SWAGGER_API_DESCRIPTION,
  SWAGGER_API_CURRENT_VERSION,
} from '../constants';

export const setupSwagger = (app: INestApplication) => {
  const logger = new Logger('Swagger');
  const options = new DocumentBuilder()
    .setTitle(SWAGGER_API_NAME)
    .setDescription(SWAGGER_API_DESCRIPTION)
    .setVersion(SWAGGER_API_CURRENT_VERSION)
    .addTag('Endpoints')
    .setContact(
      'Jackson Pham',
      'https://github.com/quankhs',
      'quanphamluong@gmail.com',
    )
    .build();
    
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(SWAGGER_API_ROOT, app, document);

  logger.log(`Swagger document at url: ${SWAGGER_API_ROOT}`);
};
