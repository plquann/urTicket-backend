import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsDate, IsDateString } from "class-validator";

export class CreateShowtimeDto {
    @IsString()
    @IsNotEmpty()
    movieId: string;

    @IsString()
    @IsNotEmpty()
    theaterId: string;

    @IsString()
    @IsNotEmpty()
    room: string;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    startTime: Date; 
}
