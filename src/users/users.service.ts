import { mailForgotPasswordTemplate } from './../common/mailHtmlTemplate';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { FilesService } from 'src/files/files.service';
import StripeService from 'src/stripe/stripe.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import MailService from 'src/mail/mail.service';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { TokenPasswordDto } from './dtos/token-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
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
      password: await bcrypt.hash(createUserDto.password, 10),
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

  async deleteUserById(userId: string): Promise<void> {
    const result = await this.usersRepository.delete(userId);
    if (!result.affected) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<User> {
    const { currentPassword, newPassword } = changePasswordDto;
    const user = await this.getUserById(userId);
    // console.log('🚀 ~ file: users.service.ts ~ line 131 ~ user', user.password);

    const isPasswordMatching = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordMatching) {
      throw new HttpException(
        'Current password is incorrect!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersRepository.update(userId, { password: hashedPassword });

    return user;
  }

  async sendEmailForgotPassword(email: string): Promise<void> {
    const user = await this.getUserByEmail(email);

    const payload = { email };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_FORGOT_PASSWORD_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_FORGOT_PASSWORD_EXPIRATION_TIME',
      )}s`,
    });

    const url = `${this.configService.get(
      'EMAIL_FORGOT_PASSWORD_URL',
    )}?token=${token}`;

    const html = mailForgotPasswordTemplate(url, user.userName);

    await this.mailService.sendMail({
      from: '"UR-TICKET 🎉✨🎉" <bookingmovie.application@gmail.com>',
      to: email,
      subject: 'Booking Movie Platform - Reset Password',
      html,
    });
  }

  async emailChangePassword(tokenPasswordDto: TokenPasswordDto): Promise<void> {
    const { token, password } = tokenPasswordDto;
    let email = '';

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_FORGOT_PASSWORD_TOKEN_SECRET'),
      });

      if (typeof payload !== 'object' || !('email' in payload)) {
        throw new HttpException('Token is invalid', HttpStatus.BAD_REQUEST);
      }

      email = payload.email;
    } catch (err) {
      if (err?.name === 'TokenExpiredError') {
        throw new HttpException('Token is expired!', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Bad reset password token!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.getUserByEmail(email);
    const hashedPassword = await bcrypt.hash(password, 10);

    await this.usersRepository.update(user.id, { password: hashedPassword });
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
