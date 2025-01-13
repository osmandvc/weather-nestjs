import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Weather } from './schemas/weather.schema';
import { CreateWeatherDto } from './dto/create-weather.dto';

@Injectable()
export class WeatherRepository {
  constructor(
    @InjectModel(Weather.name) private weatherModel: Model<Weather>,
  ) {}

  async create(createWeatherDto: CreateWeatherDto): Promise<Weather> {
    const weather = new this.weatherModel(createWeatherDto);
    return weather.save();
  }

  async findByLocationId(
    locationId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Weather[]> {
    const query: any = { locationId };

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = startDate;
      if (endDate) query.timestamp.$lte = endDate;
    }

    return this.weatherModel.find(query).sort({ timestamp: -1 }).exec();
  }

  async findDuplicate(
    locationId: string,
    timestamp: Date,
  ): Promise<Weather | null> {
    return this.weatherModel
      .findOne({
        locationId,
        timestamp,
      })
      .exec();
  }
}
