import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from './entities/person.entity';

@Injectable()
export class PeopleService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>, // private connection: Connection,
  ) {}

  async getAllPeople(): Promise<Person[]> {
    const people = await this.personRepository.find();
    if (!people) {
      throw new HttpException('Could not find people', HttpStatus.NOT_FOUND);
    }
    return people;
  }

  async create(createPersonDto: CreatePersonDto): Promise<Person> {
    try {
      const newPerson = await this.personRepository.create(createPersonDto);
      await this.personRepository.save(newPerson);

      return newPerson;
    } catch (error) {
      throw new HttpException(
        'Could not create Person',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getPersonById(personId: string): Promise<Person> {
    const person = await this.personRepository.findOne({ id: personId });
    if (!person) {
      throw new HttpException('Person not found', HttpStatus.NOT_FOUND);
    }
    return person;
  }

  async updatePersonById(
    personId: string,
    updatePersonDto: UpdatePersonDto,
  ): Promise<Person> {
    await this.personRepository.update(personId, updatePersonDto);

    const updatePerson = await this.personRepository.findOne(personId);
    if (!updatePerson) {
      throw new HttpException('Person not found!', HttpStatus.NOT_FOUND);
    }

    return updatePerson;
  }
}
