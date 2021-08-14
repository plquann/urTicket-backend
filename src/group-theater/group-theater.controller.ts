import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GroupTheaterService } from './group-theater.service';
import { CreateGroupTheaterDto } from './dto/create-group-theater.dto';
import { UpdateGroupTheaterDto } from './dto/update-group-theater.dto';

@Controller('group-theater')
export class GroupTheaterController {
  constructor(private readonly groupTheaterService: GroupTheaterService) {}

  @Post()
  create(@Body() createGroupTheaterDto: CreateGroupTheaterDto) {
    return this.groupTheaterService.create(createGroupTheaterDto);
  }

  @Get()
  findAll() {
    return this.groupTheaterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupTheaterService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGroupTheaterDto: UpdateGroupTheaterDto,
  ) {
    return this.groupTheaterService.update(+id, updateGroupTheaterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupTheaterService.remove(+id);
  }
}
