import {
  Controller,
  Get,
  Post,
  Body,
  Param,
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
import { PaginationDto } from 'src/common/pagination.dto';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ForAdmin } from 'src/common/swagger.decorator';

@ApiTags('Movies')
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  @ApiCreatedResponse()
  @ApiUnauthorizedResponse()
  @ForAdmin()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.movieService.createMovie(createMovieDto);
  }

  @Get()
  @ApiOkResponse()
  @ApiNotFoundResponse()
  getAllMovies(
    @Query('genre') genre: string,
    @Query()
    { page, limit, startId }: PaginationDto,
  ) {
    if (genre) {
      return this.movieService.getMovieByGenre(page, limit, genre);
    }
    return this.movieService.getAllMovies(page, limit, startId);
  }

  @Get('/search')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  searchMovies(@Query('searchTerm') searchTerm: string) {
    return this.movieService.searchForMovies(searchTerm);
  }

  @Get('/now_playing')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  getMoviesNowPlaying() {
    return this.movieService.getMovieByStatus(MovieStatus.PLAYING);
  }

  @Get('/upcoming')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  getMoviesUpcoming() {
    return this.movieService.getMovieByStatus(MovieStatus.UPCOMING);
  }

  @Get('/highlight')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  getHighlightMovies() {
    return this.movieService.getMovieHighlight();
  }

  @Get(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  findOne(@Param('id') id: string) {
    return this.movieService.getMovieById(id);
  }

  @Put(':id')
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ForAdmin()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  updateMovie(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.movieService.updateMovieById(id, updateMovieDto);
  }
}
