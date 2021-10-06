import { Controller, Get, Param } from '@nestjs/common';
import { TheatersService } from './theaters.service';

import { ApiTags } from '@nestjs/swagger';
@ApiTags('Theaters')
@Controller('theaters')
export class TheatersController {
  constructor(private readonly theatersService: TheatersService) {}

  @Get()
  getAllTheaters() {
    return this.theatersService.getAllTheaters();
  } 

  @Get(':id')
  getTheaterById(@Param('id') id: string) {
    return this.theatersService.getTheaterById(id);
  }

}
