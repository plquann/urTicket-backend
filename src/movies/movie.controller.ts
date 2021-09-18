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

  @ApiCreatedResponse()
  @ApiUnauthorizedResponse()
  @ForAdmin()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.movieService.createMovie(createMovieDto);
  }

  @ApiCreatedResponse()
  @ApiUnauthorizedResponse()
  @ForAdmin()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Post('/seeders')
  seedersMovies() {
    return this.movieService.seedersMovies();
  }

  @ApiOkResponse()
  @ApiNotFoundResponse()
  @Get()
  getAllMovies(
    @Query('searchTerm') searchTerm: string,
    @Query()
    { page, limit, startId }: PaginationDto,
  ) {
    if (searchTerm) {
      return this.movieService.searchForMovies(page, limit, searchTerm);
    }
    return this.movieService.getAllMovies(page, limit, startId);
  }

  @ApiOkResponse()
  @ApiNotFoundResponse()
  @Get('/now_playing')
  getMoviesNowPlaying() {
    return this.movieService.getMovieByStatus(MovieStatus.PLAYING);
  }

  @ApiOkResponse()
  @ApiNotFoundResponse()
  @Get('/upcoming')
  getMoviesUpcoming() {
    return this.movieService.getMovieByStatus(MovieStatus.UPCOMING);
  }

  @ApiOkResponse()
  @ApiNotFoundResponse()
  @Get('/highlight')
  getHighlightMovies() {
    return this.movieService.getMovieHighlight();
  }

  @ApiOkResponse()
  @ApiNotFoundResponse()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movieService.getMovieById(id);
  }

  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ForAdmin()
  @Put(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  updateMovie(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.movieService.updateMovieById(id, updateMovieDto);
  }
}
