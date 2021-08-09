import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Req,
  UploadedFile,
} from '@nestjs/common';
import { Express } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { UserRole } from 'src/constants';
import { FileInterceptor } from '@nestjs/platform-express';
import RequestWithUser from 'src/auth/interfaces/requestWithUser.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('avatar')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addAvatar(
    @Req() request: RequestWithUser,
    @UploadedFile() file:  Express.Multer.File,
  ) {
    return this.userService.addAvatar(
      request.user.id,
      file.buffer,
      file.originalname,
    );
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  findAll() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  findOne(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUserById(id, updateUserDto);
  }

  @Patch('block/:id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  blockUser(@Param('id') id: string) {
    return this.userService.blockUserById(id);
  }

  @Patch('unblock/:id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  unBlockUser(@Param('id') id: string) {
    return this.userService.unBlockUserById(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUserById(id);
  }
}
