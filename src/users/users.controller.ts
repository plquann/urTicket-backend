import { Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('all')
  async getAll(): Promise<User[]> {
    console.log('getall');
    return await this.usersService.findAll();
  }
  @Post('user')
  async createUser(): Promise<User> {
    return await this.usersService.create();
  }
}
