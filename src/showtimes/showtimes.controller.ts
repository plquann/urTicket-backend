import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';

@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Post()
  createShowtime(@Body() createShowtimeDto: CreateShowtimeDto) {
    return this.showtimesService.createShowtime(createShowtimeDto);
  }

  @Get('/movie/:movieId')
  getShowtimesByMovieId(@Param('movieId') movieId: string) {
    return this.showtimesService.getShowtimesByMovieId(movieId);
  }


  @Get('/theater/:theaterId')
  getShowtimesByTheaterId(@Param('theaterId') theaterId: string) {
    return this.showtimesService.getShowtimesByTheaterId(theaterId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateShowtimeDto: UpdateShowtimeDto,
  ) {
    return this.showtimesService.update(+id, updateShowtimeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.showtimesService.remove(+id);
  }
}
