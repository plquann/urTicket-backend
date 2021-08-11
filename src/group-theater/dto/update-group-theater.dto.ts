import { PartialType } from '@nestjs/swagger';
import { CreateGroupTheaterDto } from './create-group-theater.dto';

export class UpdateGroupTheaterDto extends PartialType(CreateGroupTheaterDto) {}
