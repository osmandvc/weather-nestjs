import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { Weather, WeatherSchema } from './schemas/weather.schema';
import { WeatherRepository } from './weather.repository';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/database/mongodb/database.module';
import { LocationModule } from '../location/location.module';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      {
        name: Weather.name,
        schema: WeatherSchema,
      },
    ]),
    LocationModule,
    ConfigModule,
  ],
  controllers: [WeatherController],
  providers: [WeatherService, WeatherRepository],
  exports: [WeatherService],
})
export class WeatherModule {}
