import { setupSwagger } from './swagger/index';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import { fastifyHelmet } from 'fastify-helmet';
import * as cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('main');

  const app = await NestFactory.create(AppModule);

  setupSwagger(app);

  // app.useGlobalFilters(new HttpExceptionFilter());
  // //app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  app.useGlobalPipes(new ValidationPipe({ skipMissingProperties: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.use(cookieParser());
  app.enableCors();
  // await app.register(fastifyHelmet);
  await app.listen(5000);

  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
