import { Module } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { SeatsController } from './seats.controller';
import { Seat } from './entities/seat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Seat])],
  controllers: [SeatsController],
  providers: [SeatsService],
})
export class SeatsModule {}
