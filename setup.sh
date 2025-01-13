#!/bin/bash

# Create locations
echo "Creating locations..."

# Berlin
echo "Creating Berlin..."
curl -X POST http://localhost:3000/location \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 52.52,
    "longitude": 13.41,
    "name": "Berlin"
  }' || { echo "Failed to create Berlin location"; exit 1; }
echo -e "\n"

# Vienna
echo "Creating Vienna..."
curl -X POST http://localhost:3000/location \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 48.2082,
    "longitude": 16.3738,
    "name": "Vienna"
  }' || { echo "Failed to create Vienna location"; exit 1; }
echo -e "\n"

# Munich
echo "Creating Munich..."
curl -X POST http://localhost:3000/location \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 48.1351,
    "longitude": 11.5820,
    "name": "Munich"
  }' || { echo "Failed to create Munich location"; exit 1; }
echo -e "\n"

# Fetch initial weather data
echo "Fetching weather data for all locations..."
curl -X POST http://localhost:3000/weather/fetch-all || { echo "Failed to fetch weather data"; exit 1; }
echo -e "\n"

echo "Setup complete! The following locations have been created:"
echo "- Berlin (52.52, 13.41)"
echo "- Vienna (48.2082, 16.3738)"
echo "- Munich (48.1351, 11.5820)"
echo "Weather data has been fetched for all locations."
