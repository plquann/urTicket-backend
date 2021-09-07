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
import { ForAdmin } from 'src/common/swagger.decorator';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('GroupTheater')
@Controller('group-theater')
export class GroupTheaterController {
  constructor(private readonly groupTheaterService: GroupTheaterService) {}

  @ForAdmin()
  @Post('seeders')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  seeders() {
    return this.groupTheaterService.seedersGroupTheaters();
  }

  @ApiOkResponse()
  @Get()
  getAllGroupTheater() {
    return this.groupTheaterService.getAllGroupTheaters();
  }

  @ApiOkResponse()
  @Get(':id')
  getGroupTheater(@Param('id') id: string) {
    return this.groupTheaterService.getGroupTheaterById(id);
  }
}
