import { setupSwagger } from './swagger/index';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const port = process.env.PORT ?? 5000;
  const logger = new Logger('main');

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  setupSwagger(app);
  app.enableCors();
  await app.listen(5000);

  logger.log(`App running at port: ${port}`);
}
bootstrap();
