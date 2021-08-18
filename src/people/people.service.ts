import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from './entities/person.entity';
import { peopleSeeds } from './seeds/people.seed';

@Injectable()
export class PeopleService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
  ) // private connection: Connection,
  {}

  async create(createPersonDto: CreatePersonDto): Promise<Person> {
    const newPerson = await this.personRepository.create(createPersonDto);
    await this.personRepository.save(newPerson);

    return newPerson;
  }

  async seedPeople(): Promise<any> {
    const people = peopleSeeds;
    const result = await this.personRepository
      .createQueryBuilder()
      .insert()
      .into(Person)
      .values(people)
      .execute();

      if(!result) {
        throw new HttpException('Could not seed people', HttpStatus.BAD_REQUEST);
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

  async deletePersonById(personId: string): Promise<void> {
    const deletePerson = await this.personRepository.delete(personId);
    if (!deletePerson.affected) {
      throw new HttpException('Person not found', HttpStatus.NOT_FOUND);
    }
  }
}
