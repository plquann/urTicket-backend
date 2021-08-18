import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from './entities/person.entity';

@Injectable()
export class PeopleService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
  ) {}

  async create(createPersonDto: CreatePersonDto): Promise<Person> {
    const newPerson = await this.personRepository.create(createPersonDto);
    await this.personRepository.save(newPerson);

    return newPerson;
  }

  async updatePersonById(
    personId: string,
    updatePersonDto: UpdatePersonDto,
  ): Promise<Person> {
    return await this.personRepository.save({
      id: personId,
      ...updatePersonDto,
    });
  }
}
