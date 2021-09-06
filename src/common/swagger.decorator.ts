import { ApiOperation } from '@nestjs/swagger';

export const ForAdmin: () => MethodDecorator = () =>
  ApiOperation({ summary: 'ADMIN' });
