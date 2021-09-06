import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieStatus, UserRole } from 'src/constants';
import { Roles } from 'src/auth/decorators/roles.decorators';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PaginationParams } from 'src/common/paginationParams';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('movies')
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.movieService.createMovie(createMovieDto);
  }

  @Post('/seeders')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  seedersMovies() {
    return this.movieService.seedersMovies();
  }

  @Get()
  getAllMovies(
    // @Query('search') search: string,
    @Query()
    { page, limit, startId }: PaginationParams,
  ) {
    return this.movieService.getAllMovies(page, limit, startId);
  }

  @Get('/now_playing')
  getMoviesNowPlaying() {
    return this.movieService.getMovieByStatus(MovieStatus.PLAYING);
  }

  @Get('/upcoming')
  getMoviesUpcoming() {
    return this.movieService.getMovieByStatus(MovieStatus.UPCOMING);
  }

  @Get('/highlight')
  getHighlightMovies() {
    return this.movieService.getMovieHighlight();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movieService.getMovieById(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  updateMovie(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.movieService.updateMovieById(id, updateMovieDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.movieService.deleteMovieById(id);
  }
}
