import { Controller, Get } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Seats')
@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @Get('/')
  getAllSeats() {
    return this.seatsService.getAll();
  }
}
