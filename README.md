# Weather Dashboard

## About the project

Weather Dashboard is a simple web application that allows users to check weather information for different cities around the world.

The application uses the Open-Meteo API to get real-time weather information and forecasts. 

I built this project as part of my Web Infrastructure assignment at African Leadership University. 

## Features

- Search for weather by city name
- View current temperature
- Check humidity and wind speed
- View weather condition
- See a seven-day weather forecast
- Filter forecast days by weather condition
- Display error messages when something goes wrong
- Use the application on phones and computures

## Technologies Used

- HTML for the webpage structure 
- CSS for styling
- Javascript for functionality
- Open-Metro API for weather infromation 
- Nginx for load balancing
- HAProxy for load balancing 
- Git and Github for version control 

## APIs Used

This project uses two Open-Meteo services.

1. Geocoding API 

This API finds a city's coordinates using  its name. 

https://geocoding-api.open-meteo.com/v1/search 

2. Weather Forecast API

This API provides current weather information and daily forecasts.

https://api.open-meteo.com/v1/forecast

API documentation:
https://open-meteo.com/en/docs

Open-Meteo provides free non-comercial API access without an API key.

Weather data attribution: Open-pMeteo.com

## How to Run the Project

1. Download or clone the repsitory.
2. Open the project folder. 
3. Open index.html in a web browser. 
4. Enter a city name. 
5. Click the Search button to view weather infromation. 

An internet connection is required to access weather data. 

## Deployment 

The application is designed to run on two servers using Nginx.

HAProxy is used as a load balancer to distribute required between the two servers. 

Web servers:
- Web01
- Web02

Load balancer:
- LB01

## Projecy Links

Github Repository: Add your repository Link here. 

Deployed Application: Add your deployment link here. 

Demo Video: Add your video link here. 

## Author

Add your name here. 

African Leadership University
Web Infrastracture Assignment 