import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieStatus } from 'src/constants';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.movieService.createMovie(createMovieDto);
  }

  @Post('/seeders')
  seedersMovies() {
    return this.movieService.seedersMovies();
  }

  @Get()
  getAllMovies() {
    return this.movieService.getAllMovies();
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
  updateMovie(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.movieService.updateMovieById(id, updateMovieDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movieService.deleteMovieById(id);
  }
}
