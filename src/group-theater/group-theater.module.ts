import { Module } from '@nestjs/common';
import { GroupTheaterService } from './group-theater.service';
import { GroupTheaterController } from './group-theater.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupTheater } from './entities/group-theater.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GroupTheater])],
  controllers: [GroupTheaterController],
  providers: [GroupTheaterService],
})
export class GroupTheaterModule {}
