import { Module } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { ShowtimesController } from './showtimes.controller';
import { Showtime } from './entities/showtime.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieModule } from 'src/movies/movie.module';
import { TheatersModule } from 'src/theaters/theaters.module';
import { TicketsModule } from 'src/tickets/tickets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Showtime]),
    MovieModule,
    TheatersModule,
    TicketsModule,
  ],
  controllers: [ShowtimesController],
  providers: [ShowtimesService],
})
export class ShowtimesModule {}
