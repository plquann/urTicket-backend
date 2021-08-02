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

async function bootstrap() {
  const logger = new Logger('main');
  const configService = new ConfigService();
  const PORT = configService.get<number>('PORT');

  const app = await NestFactory.create(AppModule);

  setupSwagger(app);

  // app.useGlobalFilters(new HttpExceptionFilter());
  // app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  app.useGlobalPipes(new ValidationPipe({ skipMissingProperties: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.use(cookieParser());
  app.enableCors();
  app.use(helmet());
  await app.listen(PORT);

  logger.log(`Application is running on: http://127.0.0.1:${PORT}/`);
}
bootstrap();
