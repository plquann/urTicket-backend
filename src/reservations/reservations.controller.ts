import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import RequestWithUser from 'src/auth/interfaces/requestWithUser.interface';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { UserRole } from 'src/constants';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  createReservation(
    @Body() createReservationDto: CreateReservationDto,
    @Req() request: RequestWithUser,
  ) {
    return this.reservationsService.createReservation(
      request.user.id,
      createReservationDto,
    );
  }

  @Get('user/:id')
  @UseGuards(JwtAuthenticationGuard)
  getReservationsByUserId(@Req() request: RequestWithUser) {
    return this.reservationsService.getReservationsByUserId(request.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  getReservationById(@Param('id') id: string) {
    return this.reservationsService.getReservationById(id);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  getAllReservations() {
    return this.reservationsService.getAllReservations();
  }
}
