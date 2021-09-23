import { ApiTags } from '@nestjs/swagger';
import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { UserRole } from 'src/constants';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ForAdmin } from 'src/common/swagger.decorator';
@ApiTags('Tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get('/showtime/:id')
  getTicketsByShowtime(@Param('id') id: string) {
    return this.ticketsService.getTicketsByShowtime(id);
  }

  @Delete('/remove-tickets')
  @ForAdmin()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  destroyTicketsWithoutReservation() {
    return this.ticketsService.destroyTicketsWithNoReservationId();
  }
}
