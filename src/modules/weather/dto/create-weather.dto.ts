import { IsDate, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWeatherDto {
  @IsDate()
  @Type(() => Date)
  timestamp: Date;

  @IsString()
  locationId: string;

  @IsString()
  locationName: string;

  @IsNumber()
  temperature: number;
}
