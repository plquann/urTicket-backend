import { GroupTheater } from './entities/group-theater.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGroupTheaterDto } from './dto/create-group-theater.dto';
import { UpdateGroupTheaterDto } from './dto/update-group-theater.dto';
import { Repository } from 'typeorm';
import { theaterGroupSeed } from 'src/database/seeds/theaterGroup.seed';

@Injectable()
export class GroupTheaterService {
  constructor(
    @InjectRepository(GroupTheater)
    private readonly groupTheaterRepository: Repository<GroupTheater>,
  ) {}

  async seedersGroupTheaters(): Promise<void> {
    const groupTheaters = theaterGroupSeed;

    const result = await this.groupTheaterRepository
      .createQueryBuilder()
      .insert()
      .into(GroupTheater)
      .values(groupTheaters)
      .execute();

    if (!result) {
      throw new HttpException(
        'Could not seed group theater',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

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
