import { UserRole } from './../constants/index';
import { Controller, Post, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { SeatsService } from './seats.service';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Seats')
@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @Post('/seeders')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  seeders() {
    return this.seatsService.seedersSeats();
  }
}
