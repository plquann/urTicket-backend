import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to UrTicket Api! Check out /api/v1/doc for details!';
  }
}
