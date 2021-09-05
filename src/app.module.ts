import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { MovieModule } from './movies/movie.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ReviewsModule } from './reviews/reviews.module';
import { PeopleModule } from './people/people.module';
import { TheatersModule } from './theaters/theaters.module';
import { SeatsModule } from './seats/seats.module';
import { ReservationsModule } from './reservations/reservations.module';
import { ProductsModule } from './products/products.module';
import { ShowtimesModule } from './showtimes/showtimes.module';
import { GroupTheaterModule } from './group-theater/group-theater.module';
import { GenresModule } from './genres/genres.module';
import { TicketsModule } from './tickets/tickets.module';
import { StripeModule } from './stripe/stripe.module';
import { CardsModule } from './cards/cards.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DATABASE: Joi.string().required(),

        PORT: Joi.number(),

        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),

        EMAIL_SERVICE: Joi.string().required(),
        EMAIL_USER: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),

        JWT_VERIFICATION_TOKEN_SECRET: Joi.string().required(),
        JWT_VERIFICATION_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        EMAIL_CONFIRMATION_URL: Joi.string().required(),

        AWS_REGION: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_PUBLIC_BUCKET_NAME: Joi.string().required(),

        //PAYMENT WITH STRIPE
        STRIPE_SECRET_KEY: Joi.string().required(),
        STRIPE_CURRENCY: Joi.string().required(),
        FRONTEND_URL: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    UsersModule,
    MovieModule,
    AuthModule,
    ReviewsModule,
    PeopleModule,
    TheatersModule,
    SeatsModule,
    ReservationsModule,
    ProductsModule,
    ShowtimesModule,
    GroupTheaterModule,
    GenresModule,
    TicketsModule,
    StripeModule,
    CardsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
