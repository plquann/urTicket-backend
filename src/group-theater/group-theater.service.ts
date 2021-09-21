import { GroupTheater } from './entities/group-theater.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GroupTheaterService {
  constructor(
    @InjectRepository(GroupTheater)
    private readonly groupTheaterRepository: Repository<GroupTheater>,
  ) {}

  async getAllGroupTheaters(): Promise<GroupTheater[]> {
    return await this.groupTheaterRepository.find();
  }

  async getGroupTheaterById(groupTheaterId: string): Promise<GroupTheater> {
    const groupTheater = await this.groupTheaterRepository.findOne(
      groupTheaterId,
    );

    if (!groupTheater) {
      throw new HttpException(
        `Group theater with id ${groupTheaterId} does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }

    return groupTheater;
  }
}
