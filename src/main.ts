import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';

const port = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: ['debug', 'error', 'log', 'verbose', 'warn'],
  });
  app.use(cookieParser());
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  const config = new DocumentBuilder()
    .setTitle('Star Wars Movies Backend Services')
    .setDescription('REST API backend services for Star Wars ')
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth('optional-session-id')
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(port);
  Logger.log(`Server started on http://localhost:${port}, Boostrap`);
}
bootstrap();
