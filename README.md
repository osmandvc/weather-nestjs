# Weather API Documentation

## Setup

To start the mongodb and api container, run the following command:

```bash
docker-compose up
```

After starting the containers, run the setup script in a Unix-based shell (Git Bash, WSL, or native Unix terminal) to create sample locations and fetch initial weather data:

````bash
chmod +x setup.sh
./setup.sh

## Available Endpoints

### Location Endpoints

1. Create a new location

```bash
curl -X POST http://localhost:3000/location \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 52.52,
    "longitude": 13.41,
    "name": "Berlin"
  }'
````

2. Get all locations

```bash
curl -X GET http://localhost:3000/location
```

3. Get location by ID

```bash
curl -X GET http://localhost:3000/location/YOUR_LOCATION_ID
```

4. Update location

```bash
curl -X PUT http://localhost:3000/location/YOUR_LOCATION_ID \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Berlin"
  }'
```

5. Delete location

```bash
curl -X DELETE http://localhost:3000/location/YOUR_LOCATION_ID
```

### Weather Endpoints

1. Fetch weather for all locations

```bash
curl -X POST http://localhost:3000/weather/fetch-all
```

2. Get weather history for a location

```bash
# Without date range
curl -X GET "http://localhost:3000/weather/history?locationId=YOUR_LOCATION_ID"

# With date range
curl -X GET "http://localhost:3000/weather/history?locationId=YOUR_LOCATION_ID&startDate=2025-01-13T00:00:00Z&endDate=2025-01-13T23:59:59Z"
```

## Sample Location Coordinates

Here are some sample locations you can use:

1. Berlin, Germany

   - Latitude: 52.52
   - Longitude: 13.41

2. Vienna, Austria

   - Latitude: 48.2082
   - Longitude: 16.3738

3. Munich, Germany
   - Latitude: 48.1351
   - Longitude: 11.5820

## Viewing the Data

You can view and interact with the MongoDB data using MongoDB Compass or any other MongoDB client tool. The MongoDB instance is accessible at:

```
mongodb://localhost:27018
```

## Response Examples

### Location Response

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Berlin",
  "latitude": 52.52,
  "longitude": 13.41
}
```

### Weather Response

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "timestamp": "2025-01-13T16:00:00Z",
  "locationId": "507f1f77bcf86cd799439011",
  "locationName": "Berlin",
  "temperature": 20.5
}
```

## Notes

- Weather data is fetched from the Open-Meteo API
- Weather records are stored hourly
- Duplicate weather records (same location and timestamp) are not stored
