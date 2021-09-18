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
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorators';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ForAdmin } from 'src/common/swagger.decorator';
import { UserRole } from 'src/constants';
import { Genre } from './entities/genre.entity';
import { GenresService } from './genres.service';

@ApiTags('Genres')
@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  create(@Body() genre: Genre) {
    return this.genresService.create(genre);
  }

  @ForAdmin()
  @ApiCreatedResponse()
  @Post('/seeders')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  seedersGenres(){
    return this.genresService.seedersGenres();
  }

  @ApiOkResponse()
  @Get()
  getAll() {
    return this.genresService.getAllGenres();
  }

  @ForAdmin()
  @Put(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  updateGenre(@Param('id') id: string, @Body() payload: any) {
    const {name: genreName} = payload;
    return this.genresService.updateGenreById(id, genreName);
  }

  @ForAdmin()
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  deleteGenre(@Param('id') id: string) {
    return this.genresService.deleteGenreById(id);
  }
}
