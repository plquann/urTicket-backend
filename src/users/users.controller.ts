import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Req,
  UploadedFile,
} from '@nestjs/common';
import { Express, Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { UserRole } from 'src/constants';
import { FileInterceptor } from '@nestjs/platform-express';
import RequestWithUser from 'src/auth/interfaces/requestWithUser.interface';
import { ForAdmin } from 'src/common/swagger.decorator';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { TokenPasswordDto } from './dtos/token-password.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthenticationGuard)
  async uploadAvatar(
    @Req() request: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.addAvatar(
      request.user.id,
      file.buffer,
      file.originalname,
    );
  }

  @Get('me')
  @UseGuards(JwtAuthenticationGuard)
  async getMe(@Req() request: RequestWithUser): Promise<any> {
    const me = request.user.id;
    return this.userService.getUserById(me);
  }

  @Post('me')
  @UseGuards(JwtAuthenticationGuard)
  async updateMe(
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: RequestWithUser,
  ): Promise<any> {
    const me = request.user.id;
    return this.userService.updateUserById(me, updateUserDto);
  }

  @Post('me/change-password')
  @ApiOkResponse()
  @UseGuards(JwtAuthenticationGuard)
  async changePassword(
    @Req() request: RequestWithUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const me = request.user.id;
    return this.userService.changePassword(me, changePasswordDto);
  }

  @Post('/forgot-password')
  @ApiOkResponse()
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.userService.sendEmailForgotPassword(forgotPasswordDto.email);
  }

  @Post('/email-password-change')
  async emailChangePassword(@Body() tokenPasswordDto: TokenPasswordDto) {
    return this.userService.emailChangePassword(tokenPasswordDto);
  }

  @Get()
  @ForAdmin()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  getAll() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthenticationGuard)
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUserById(id, updateUserDto);
  }

  // @Put('block/:id')
  // @Roles(UserRole.ADMIN)
  // @UseGuards(JwtAuthenticationGuard, RolesGuard)
  // blockUser(@Param('id') id: string) {
  //   return this.userService.blockUserById(id);
  // }

  // @Put('unblock/:id')
  // @Roles(UserRole.ADMIN)
  // @UseGuards(JwtAuthenticationGuard, RolesGuard)
  // unBlockUser(@Param('id') id: string) {
  //   return this.userService.unBlockUserById(id);
  // }

  @Delete('avatar')
  @UseGuards(JwtAuthenticationGuard)
  deleteAvatar(@Req() request: RequestWithUser) {
    return this.userService.deleteAvatar(request.user.id);
  }

  @Delete(':id')
  @ForAdmin()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUserById(id);
  }
}
