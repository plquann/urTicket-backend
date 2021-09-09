import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './swagger/index';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './filters/http-exception.filter';
import { config } from 'aws-sdk';
async function bootstrap() {
  const logger = new Logger('main');

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  setupSwagger(app);

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT');

  // app.useGlobalFilters(new HttpExceptionFilter());
  // app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  app.useGlobalPipes(new ValidationPipe({ skipMissingProperties: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.use(cookieParser());
  
  app.enableCors({
    origin: configService.get('FRONTEND_URL'),
    credentials: true,
  });

  app.use(helmet());

  //amazon s3 config
  config.update({
    accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    region: configService.get('AWS_REGION'),
  });

  await app.listen(PORT);

  logger.log(`Application is running on: http://localhost:${PORT}/`);
}
bootstrap();
