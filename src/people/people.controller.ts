import { ForAdmin } from './../common/swagger.decorator';
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PeopleService } from './people.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { UserRole } from 'src/constants';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('People')
@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Post()
  @ForAdmin()
  @ApiCreatedResponse()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.peopleService.create(createPersonDto);
  }

  @Get()
  @ApiOkResponse()
  @ApiNotFoundResponse()
  getAllPeople() {
    return this.peopleService.getAllPeople();
  }

  @Get(':id')
  @ApiOkResponse()
  getOnePerson(@Param('id') personId: string) {
    return this.peopleService.getPersonById(personId);
  }

  @Put(':id')
  @ApiCreatedResponse()
  @ForAdmin()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  update(
    @Param('id') personId: string,
    @Body() updatePersonDto: UpdatePersonDto,
  ) {
    return this.peopleService.updatePersonById(personId, updatePersonDto);
  }
}
