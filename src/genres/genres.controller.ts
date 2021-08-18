import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorators';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/constants';
import { Genre } from './entities/genre.entity';
import { GenresService } from './genres.service';

@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  create(@Body() genre: Genre) {
    return this.genresService.create(genre);
  }

  @Get()
  getAll() {
    return this.genresService.findAll();
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  updateGenre(@Param('id') id: string, @Body() payload: any) {
    const {name: genreName} = payload;
    return this.genresService.updateGenreById(id, genreName);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  deleteGenre(@Param('id') id: string) {
    return this.genresService.deleteGenreById(id);
  }
}
