import { CommentsModule } from './comment/comments.module';
import { DatabaseModule } from './database/database.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import * as Joi from '@hapi/joi';

@Module({
  imports: [
    CommentsModule,
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        POSTGRES_HEROKU_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_HEROKU_USER: Joi.string().required(),
        POSTGRES_HEROKU_PASSWORD: Joi.string().required(),
        POSTGRES_HEROKU_DB: Joi.string().required(),
        PORT: Joi.number(),
      }),
    }),
    DatabaseModule,
    MoviesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
