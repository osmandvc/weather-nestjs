import { Module } from '@nestjs/common';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { LocationRepository } from './location.repository';
import { Location, LocationSchema } from './schemas/location.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from 'src/database/mongodb/database.module';

@Module({
  controllers: [LocationController],
  providers: [LocationService, LocationRepository],
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Location.name, schema: LocationSchema },
    ]),
  ],
  exports: [LocationService],
})
export class LocationModule {}
