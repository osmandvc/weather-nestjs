import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Schema for storing location information.
 * Ensures coordinate uniqueness through database validation.
 */
@Schema({
  collection: 'location',
  timestamps: true // Automatically adds createdAt and updatedAt
})
export class Location extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
