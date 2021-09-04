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
}
