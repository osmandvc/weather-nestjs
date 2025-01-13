import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Location } from '../../location/schemas/location.schema';

/**
 * Schema for storing hourly weather measurements.
 * Configured as a time-series collection for efficient temporal queries.
 */
@Schema({
  collection: 'weather',
  timeseries: {
    timeField: 'timestamp',
    metaField: 'locationId',
    granularity: 'hours',
  },
})
export class Weather extends Document {
  @Prop({ type: Date, required: true })
  timestamp: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Location', required: true })
  locationId: Location;

  @Prop({ required: true })
  locationName: string;

  @Prop({ required: true })
  temperature: number;
}

export const WeatherSchema = SchemaFactory.createForClass(Weather);
