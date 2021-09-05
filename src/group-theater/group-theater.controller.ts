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
import { GroupTheaterService } from './group-theater.service';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { UserRole } from 'src/constants';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('group-theater')
export class GroupTheaterController {
  constructor(private readonly groupTheaterService: GroupTheaterService) {}

  @Post('seeders')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  seeders() {
    return this.groupTheaterService.seedersGroupTheaters();
  }

  @Get()
  getAllGroupTheater() {
    return this.groupTheaterService.getAllGroupTheaters();
  }

  @Get(':id')
  getGroupTheater(@Param('id') id: string) {
    return this.groupTheaterService.getGroupTheaterById(id);
  }
}
