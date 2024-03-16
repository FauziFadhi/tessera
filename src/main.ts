import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { satisfies } from 'semver';
import { engines } from '../package.json';
import { Logger, VersioningType } from '@nestjs/common';
import { CustomValidationPipe } from '@utils/pipes';
import { BaseExceptionFilter, HttpExceptionFilter } from '@utils/filters';

async function bootstrap() {
  const nodeVersion = engines.node;
  if (!satisfies(process.version, nodeVersion)) {
    console.log(
      `Required node version ${nodeVersion} not satisfied with current version ${process.version}.`,
    );
    process.exit();
  }

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(
    new CustomValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const logger = new Logger();
  app.useGlobalFilters(
    new HttpExceptionFilter(logger),
    new BaseExceptionFilter(logger),
  );

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: '*',
    credentials: false,
  });

  await app.listen(3000);
}
bootstrap();
