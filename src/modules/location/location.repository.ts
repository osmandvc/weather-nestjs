import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Location } from './schemas/location.schema';
import { ILocationRepository } from 'src/common/interfaces/repository.interface';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationRepository implements ILocationRepository {
  constructor(
    @InjectModel(Location.name) private locationModel: Model<Location>,
  ) {}

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    const location = await this.findDuplicate(createLocationDto.latitude, createLocationDto.longitude);
    if (location) {
      throw new Error('A location with these coordinates already exists');
    }
    const createdLocation = new this.locationModel(createLocationDto);
    return createdLocation.save();
  }

  async findDuplicate(latitude: number, longitude: number): Promise<Location | null> {
    return this.locationModel.findOne({
      latitude,
      longitude,
    }).exec();
  }

  async findAll(): Promise<Location[]> {
    return this.locationModel.find().exec();
  }

  async findById(id: string): Promise<Location | null> {
    return this.locationModel.findById(id).exec();
  }

  async update(
    id: string,
    updateLocationDto: UpdateLocationDto,
  ): Promise<Location | null> {
    // Check if update would create a duplicate
    if (updateLocationDto.latitude !== undefined && updateLocationDto.longitude !== undefined) {
      const duplicate = await this.findDuplicate(
        updateLocationDto.latitude,
        updateLocationDto.longitude,
      );
      if (duplicate && duplicate._id.toString() !== id) {
        throw new Error('A location with these coordinates already exists');
      }
    }

    return this.locationModel
      .findByIdAndUpdate(id, updateLocationDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Location | null> {
    return this.locationModel.findByIdAndDelete(id).exec();
  }
}
