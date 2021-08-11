import { PartialType } from '@nestjs/swagger';
import { CreateTheaterDto } from './create-theater.dto';

export class UpdateTheaterDto extends PartialType(CreateTheaterDto) {}
