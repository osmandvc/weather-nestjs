import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { LocationRepository } from './location.repository';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './schemas/location.schema';

/**
 * Service handling location management operations.
 * Ensures unique coordinates for each location and provides CRUD operations.
 */
@Injectable()
export class LocationService {
  constructor(private readonly locationRepository: LocationRepository) {}

  /**
   * Creates a new location after verifying coordinates are unique.
   * @throws ConflictException if location with same coordinates exists
   */
  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    try {
      return await this.locationRepository.create(createLocationDto);
    } catch (error) {
      if (error.message.includes('coordinates already exists')) {
        throw new ConflictException('A location with these coordinates already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<Location[]> {
    return this.locationRepository.findAll();
  }

  async findById(id: string): Promise<Location> {
    const location = await this.locationRepository.findById(id);
    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
    return location;
  }

  /**
   * Updates a location while ensuring coordinate uniqueness is maintained.
   * @throws ConflictException if update would create duplicate coordinates
   * @throws NotFoundException if location not found
   */
  async update(id: string, updateLocationDto: UpdateLocationDto): Promise<Location> {
    try {
      const location = await this.locationRepository.update(id, updateLocationDto);
      if (!location) {
        throw new NotFoundException(`Location with ID ${id} not found`);
      }
      return location;
    } catch (error) {
      if (error.message.includes('coordinates already exists')) {
        throw new ConflictException('A location with these coordinates already exists');
      }
      throw error;
    }
  }

  async delete(id: string): Promise<Location> {
    const location = await this.locationRepository.delete(id);
    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
    return location;
  }
}
