import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('all')
  async getAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }
}
