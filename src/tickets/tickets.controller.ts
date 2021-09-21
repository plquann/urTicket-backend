import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param } from '@nestjs/common';
import { TicketsService } from './tickets.service';
@ApiTags('Tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get('/showtime/:id')
  getTicketsByShowtime(@Param('id') id: string) {
    return this.ticketsService.getTicketsByShowtime(id);
  }
  @Get('/null')
  getNull() {
    return this.ticketsService.destroyTicketsWithoutReservation();
  }
}
