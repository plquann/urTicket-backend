import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { UserRole } from 'src/constants';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiTags } from '@nestjs/swagger';
import { DateDto } from './dto/date.dto';
import { PaginationDto } from 'src/common/pagination.dto';

@ApiTags('Showtimes')
@Controller('showtime')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  createShowtime(@Body() createShowtimeDto: CreateShowtimeDto) {
    return this.showtimesService.createShowtime(createShowtimeDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  getAllShowtimes(@Query() { page, limit }: PaginationDto) {
    return this.showtimesService.getAllShowtimes(page, limit);
  }

  @Post('/seeders')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  seedShowtimes(@Body() dateDto: DateDto) {
    return this.showtimesService.seedersShowtimes(dateDto);
  }

  @Get('/movie/:movieId')
  getShowtimesByMovieId(
    @Param('movieId') movieId: string,
    @Query() { date }: DateDto,
  ) {
    if (date) return this.showtimesService.getShowtimesByMovieId(movieId, date);
    return this.showtimesService.getShowtimesByMovieId(movieId);
  }

  @Get('/theater/:theaterId')
  getShowtimesByTheaterId(@Param('theaterId') theaterId: string) {
    return this.showtimesService.getShowtimesByTheaterId(theaterId);
  }

  @Get(':id')
  getShowtimeById(@Param('id') id: string) {
    return this.showtimesService.getShowtimeById(id);
  }

  
}
