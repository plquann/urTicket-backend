import { Module } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { ShowtimesController } from './showtimes.controller';
import { Showtime } from './entities/showtime.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TheatersModule } from 'src/theaters/theaters.module';
import { TicketsModule } from 'src/tickets/tickets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Showtime]),
    TheatersModule,
    TicketsModule,
  ],
  controllers: [ShowtimesController],
  exports: [ShowtimesService],
  providers: [ShowtimesService],
})
export class ShowtimesModule {}
