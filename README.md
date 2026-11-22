# Weather Dahboard

## About the project 

Weather Dashboard is a simple web application that allows users to check weather information for different cities around the world. 

The application uses the Open-Mteo API to get real-time weather information and forecasts. 

I built this project as part of my Web Infrastructure assignment at African Leadership University. 

## Features 

- Search for weather by city name
- View current temperature
- Check humidity and wind speed 
- View weather conditions
- See a seven-day weather forecast 
- Filter forecast days by weather condition
- Display error messages when something goes wrong 
- Use the application on phones and computers

## Technologies Used 

- HTML  for the webpage structure 
- CSS for styling
- JavaScript for functionality
- Open-Meteo API for weather information 
- Nginx for hosting the application 
- HAProxy for load balancing
- Git and GitHub for version control 

## APIs Used

This project Uses two Open-Mereo services.

1. Geocoding API 

This API finds a city's coordination using its name. 

https://geocoding-api.open-meteo.com/v1/search

2. Weather Forecast Api 

This API provides current weather information and daily forecasts. 

https://api.open-meteo.com/v1/forecast

API documentation:
https//open-meteo.com/en/docs

Open-Meteo provides free non-commercial API access without an API key.

Weather data attribution: Open-Meteo.com 

## How to Run the project 

1. Download or clone the repository. 
2. Open the project folder. 
3. Open indixe.html in a web browser. 
4. Enter a city name. 
5. Click the Search button to view weather information\.

An internet connection is required to access weather data. 

## Deployment 

The application is designed to run on two web servers using Nginx. 

HAProxy is used as a load balancer to distribute requests between two servers.

Web servers:
- Web01
- Web02

Load balancer
- LB01

## Project Links

GithHUb Repository: Add your repository link here. 

Deployed Application: Add deployment link here. 

Demo Video: Add your video link here. 

## Author

Add your name here. 

African Leadership University
Web Infrastructure Assignment 