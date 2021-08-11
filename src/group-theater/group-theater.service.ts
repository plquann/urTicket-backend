import { Injectable } from '@nestjs/common';
import { CreateGroupTheaterDto } from './dto/create-group-theater.dto';
import { UpdateGroupTheaterDto } from './dto/update-group-theater.dto';

@Injectable()
export class GroupTheaterService {
  create(createGroupTheaterDto: CreateGroupTheaterDto) {
    return 'This action adds a new groupTheater';
  }

  findAll() {
    return `This action returns all groupTheater`;
  }

  findOne(id: number) {
    return `This action returns a #${id} groupTheater`;
  }

  update(id: number, updateGroupTheaterDto: UpdateGroupTheaterDto) {
    return `This action updates a #${id} groupTheater`;
  }

  remove(id: number) {
    return `This action removes a #${id} groupTheater`;
  }
}
