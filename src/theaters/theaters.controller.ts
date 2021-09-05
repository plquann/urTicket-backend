import { UserRole } from './../constants/index';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { TheatersService } from './theaters.service';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('theaters')
export class TheatersController {
  constructor(private readonly theatersService: TheatersService) {}

 
  @Post('/seeders')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  seedersTheaters() {
    return this.theatersService.seedersTheaters();
  }

  @Get()
  getAllTheaters() {
    return this.theatersService.getAllTheaters();
  }

}
