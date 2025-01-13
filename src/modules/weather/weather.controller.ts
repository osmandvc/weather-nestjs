import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { Weather } from './schemas/weather.schema';
import { ParseDatePipe } from '../../common/pipes/parse-date.pipe';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Post()
  async createWeatherRecord(
    @Body() createWeatherDto: CreateWeatherDto,
  ): Promise<Weather> {
    return this.weatherService.createWeatherRecord(createWeatherDto);
  }

  @Post('fetch-all')
  async fetchWeatherForAllLocations(): Promise<Weather[]> {
    return this.weatherService.fetchAndStoreWeatherForAllLocations();
  }

  @Get('history')
  async getWeatherHistory(
    @Query('locationId') locationId: string,
    @Query('startDate', new ParseDatePipe()) startDate?: Date,
    @Query('endDate', new ParseDatePipe()) endDate?: Date,
  ): Promise<Weather[]> {
    return this.weatherService.getWeatherHistory(
      locationId,
      startDate,
      endDate,
    );
  }
}
