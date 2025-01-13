import { Injectable, NotFoundException } from '@nestjs/common';
import { WeatherRepository } from './weather.repository';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { Weather } from './schemas/weather.schema';
import { LocationService } from '../location/location.service';
import axios from 'axios';

interface OpenMeteoResponse {
  hourly: {
    time: string[];
    temperature_2m: number[];
  };
}

/**
 * Service responsible for managing weather data operations.
 * Handles fetching weather data from Open-Meteo API and storing it in the database.
 */
@Injectable()
export class WeatherService {
  constructor(
    private readonly weatherRepository: WeatherRepository,
    private readonly locationService: LocationService,
  ) {}

  /**
   * Creates a new weather record after checking for duplicates.
   * @returns The created or existing weather record
   */
  async createWeatherRecord(createWeatherDto: CreateWeatherDto): Promise<Weather> {
    // Check for duplicates
    const duplicate = await this.weatherRepository.findDuplicate(
      createWeatherDto.locationId,
      createWeatherDto.timestamp,
    );

    if (duplicate) {
      return duplicate;
    }

    return this.weatherRepository.create(createWeatherDto);
  }

  /**
   * Retrieves weather history for a specific location within an optional date range.
   * @throws NotFoundException if no weather data is found
   */
  async getWeatherHistory(
    locationId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Weather[]> {
    const weatherData = await this.weatherRepository.findByLocationId(
      locationId,
      startDate,
      endDate,
    );

    if (!weatherData.length) {
      throw new NotFoundException(`No weather data found for location ${locationId}`);
    }

    return weatherData;
  }

  /**
   * Fetches hourly weather data from Open-Meteo API for a specific location.
   * Converts the response into individual hourly records.
   */
  async fetchWeatherData(
    latitude: number,
    longitude: number,
    locationId: string,
    locationName: string,
  ): Promise<CreateWeatherDto[]> {
    try {
      const response = await axios.get<OpenMeteoResponse>(
        `https://api.open-meteo.com/v1/forecast`,
        {
          params: {
            latitude,
            longitude,
            hourly: 'temperature_2m',
            forecast_days: 1,
          },
        },
      );

      const { time, temperature_2m } = response.data.hourly;
      
      // Convert each hour into a separate CreateWeatherDto
      return time.map((timestamp, index) => ({
        timestamp: new Date(timestamp),
        temperature: temperature_2m[index],
        locationId,
        locationName,
      }));
    } catch (error) {
      throw new Error(`Failed to fetch weather data: ${error.message}`);
    }
  }

  /**
   * Fetches and stores weather data for all locations in the database.
   * Handles each location independently to prevent total failure if one fails.
   */
  async fetchAndStoreWeatherForAllLocations(): Promise<Weather[]> {
    // Get all locations
    const locations = await this.locationService.findAll();
    const results: Weather[] = [];

    // Fetch and store weather data for each location
    for (const location of locations) {
      try {
        const hourlyRecords = await this.fetchWeatherData(
          location.latitude,
          location.longitude,
          location._id.toString(),
          location.name,
        );

        // Create weather records for each hour
        for (const record of hourlyRecords) {
          try {
            const weatherRecord = await this.createWeatherRecord(record);
            results.push(weatherRecord);
          } catch (error) {
            console.error(
              `Failed to store weather for location ${location.name} (${location._id}) at ${record.timestamp}: ${error.message}`,
            );
            continue;
          }
        }
      } catch (error) {
        console.error(
          `Failed to fetch weather for location ${location.name} (${location._id}): ${error.message}`,
        );
        continue;
      }
    }

    return results;
  }
}
