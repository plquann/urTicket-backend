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

@ApiTags('movies')
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @ApiCreatedResponse()
  @ApiUnauthorizedResponse()
  @ForAdmin()
  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.movieService.createMovie(createMovieDto);
  }

  @ApiCreatedResponse()
  @ApiUnauthorizedResponse()
  @ForAdmin()
  @Post('/seeders')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  seedersMovies() {
    return this.movieService.seedersMovies();
  }

  @ApiOkResponse()
  @ApiNotFoundResponse()
  @Get()
  getAllMovies(
    // @Query('search') search: string,
    @Query()
    { page, limit, startId }: PaginationDto,
  ) {
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

  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ForAdmin()
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.movieService.deleteMovieById(id);
  }
}
