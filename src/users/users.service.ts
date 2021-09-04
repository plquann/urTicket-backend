import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { FilesService } from 'src/files/files.service';
import StripeService from 'src/stripe/stripe.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly filesService: FilesService,
    private stripeService: StripeService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const stripeCustomer = await this.stripeService.createCustomer(
      createUserDto.userName,
      createUserDto.email,
    );

    const newUser = await this.usersRepository.create({
      ...createUserDto,
      stripeCustomerId: stripeCustomer.id,
    });

    await this.usersRepository.save(newUser);

    return newUser;
  }

  async getAllUsers(): Promise<User[]> {
    const allUsers = await this.usersRepository.find();

    return allUsers;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ email });

    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getUserById(id: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ id });

    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.getUserById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(userId: string) {
    return await this.usersRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }

  async markEmailAsConfirmed(email: string) {
    return await this.usersRepository.update(
      { email },
      {
        isEmailConfirmed: true,
      },
    );
  }

  async updateUserById(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    await this.usersRepository.update(userId, updateUserDto);

    const updatedUser = await this.usersRepository.findOne(userId);
    if (updatedUser) {
      return updatedUser;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async deleteUserById(userId: string) {
    const result = await this.usersRepository.delete(userId);
    if (!result.affected) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async blockUserById(userId: string): Promise<User> {
    await this.usersRepository.update(userId, { isActive: false });

    const blockedUser = await this.usersRepository.findOne(userId);
    if (blockedUser) {
      return blockedUser;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async unBlockUserById(userId: string): Promise<User> {
    await this.usersRepository.update(userId, { isActive: true });

    const unBlockedUser = await this.usersRepository.findOne(userId);
    if (unBlockedUser) {
      return unBlockedUser;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async addAvatar(userId: string, imageBuffer: Buffer, fileName: string) {
    const user = await this.getUserById(userId);

    if (user.avatar) {
      await this.usersRepository.update(userId, { avatar: null });
      await this.deleteAvatar(userId);
    }

    const avatar = await this.filesService.uploadPublicFile(
      imageBuffer,
      fileName,
    );

    await this.usersRepository.update(userId, { ...user, avatar });
    return avatar;
  }

  async deleteAvatar(userId: string): Promise<void> {
    const user = await this.getUserById(userId);
    const fileId = user.avatar?.id;

    if (fileId) {
      await this.usersRepository.update(userId, { ...user, avatar: null });
    }
    await this.filesService.deletePublicFile(fileId);
  }
}
