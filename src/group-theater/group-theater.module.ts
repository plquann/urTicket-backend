import { Module } from '@nestjs/common';
import { GroupTheaterService } from './group-theater.service';
import { GroupTheaterController } from './group-theater.controller';

@Module({
  controllers: [GroupTheaterController],
  providers: [GroupTheaterService]
})
export class GroupTheaterModule {}
