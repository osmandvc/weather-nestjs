import { CreateLocationDto } from 'src/modules/location/dto/create-location.dto';
import { Location } from 'src/modules/location/schemas/location.schema';

export interface ILocationRepository {
  create(createLocationDto: CreateLocationDto): Promise<Location>;
  findAll(): Promise<Location[]>;
  findById(id: string): Promise<Location | null>;
  update(id: string, updateData: Partial<Location>): Promise<Location | null>;
  delete(id: string): Promise<Location | null>;
}
