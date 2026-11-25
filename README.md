
# Weather Dashboard

## About the Project

Weather Dashboard is a simple web application that allows users to search for different cities and access current weather information and forecasts.

The application uses the Open-Meteo API to collect weather data and display it in a simple and user-friendly interface.

I developed this project as part of my Web Infrastructure summative assignment at African Leadership University (ALU).

The main objective of this project is to demonstrate my understanding of web development, API integration, caching, error handling, server deployment, and load balancing.

## Project Links

- GitHub Repository: https://github.com/fkangira/weather-dashboard
- Deployed Application: https://fanuelkangira.tech
- Alternative HTTPS Address: https://www.fanuelkangira.tech
- Original Load Balancer URL: http://3.8.101.245:8080
- Video Demonstration: https://youtu.be/VvYf9OWLsIk

## Features

- Search for weather information by city name.
- Display current temperature.
- Display feels-like temperature.
- Check humidity and wind speed.
- Display current weather conditions.
- View a seven-day weather forecast.
- Display daily maximum and minimum temperatures.
- Filter forecast days by weather condition.
- Visualize weekly temperature changes using a temperature chart.
- Cache weather data using sessionStorage.
- Handle invalid city names and API errors.
- Responsive design for mobile phones and computers.

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML | Webpage structure |
| CSS | Styling and responsive design |
| JavaScript | Application functionality and API integration |
| SVG | Temperature chart visualization |
| Open-Meteo API | Weather information and forecasts |
| sessionStorage | Temporary weather data caching |
| Ubuntu | Server operating system |
| Nginx | Web server |
| HAProxy | Load balancing and HTTPS termination |
| DNS | Connecting the custom domain to the load balancer |
| Let's Encrypt | SSL/TLS certificates |
| Certbot | Certificate issuance and renewal |
| Git | Version control |
| GitHub | Source code management |

## APIs Used

The application uses two services provided by Open-Meteo.

### 1. Geocoding API

The Geocoding API converts a city name into geographical coordinates, including latitude and longitude.

Endpoint:

https://geocoding-api.open-meteo.com/v1/search

### 2. Weather Forecast API

The Weather Forecast API uses the geographical coordinates to retrieve current weather information and seven-day forecasts.

Endpoint:

https://api.open-meteo.com/v1/forecast

API Documentation:

https://open-meteo.com/en/docs

The application uses the free non-commercial Open-Meteo API, which does not require an API key.

Weather data is provided by Open-Meteo.

## How the Application Works

1. The user enters a city name in the search box.
2. The application uses the Geocoding API to find the city's coordinates when needed.
3. The Weather Forecast API retrieves weather information using those coordinates.
4. JavaScript processes the received data.
5. The application displays current weather information and the seven-day forecast.
6. Users can filter forecast days and view temperature changes through the chart.
7. Weather data is temporarily cached in the browser for repeated searches.

## Caching

The application uses JavaScript sessionStorage to temporarily store weather information in the browser.

When a user searches for a city that has already been searched during the same browser session, valid cached weather data can be retrieved instead of sending another weather API request.

Caching helps to:

- Reduce unnecessary API requests.
- Improve application response time.
- Improve the user experience.
- Reduce unnecessary network usage.

The cached information is temporary and is associated with the browser session.

## Error Handling

Error handling is implemented to improve application reliability.

The application handles situations such as:

- Invalid or nonexistent city names.
- Network connection problems.
- Failed API requests.
- Errors while retrieving weather information.

Instead of displaying incorrect information, the application provides an error message to inform the user when something goes wrong.

## Temperature Visualization

The application includes a temperature chart that displays maximum and minimum temperatures across seven days.

- The orange line represents maximum temperatures.
- The blue line represents minimum temperatures.
- The vertical scale displays temperatures in degrees Celsius.

This makes it easier for users to understand and compare temperature changes throughout the week.

## Project Structure

```text
weather-dashboard/
├── index.html
├── style.css
├── script.js
├── README.md
└── .gitignore
```

- index.html: Contains the webpage structure.
- style.css: Contains the application styling and layout.
- script.js: Handles API requests, weather information, caching, filtering, chart visualization, and error handling.
- README.md: Contains project documentation.
- .gitignore: Prevents unnecessary files from being tracked by Git.

## How to Run the Project Locally

### Requirements

- A web browser
- Internet connection
- Git
- Python 3 (optional, for running a local web server)

### Step 1: Clone the Repository

```bash
git clone https://github.com/fkangira/weather-dashboard.git
```

### Step 2: Open the Project Directory

```bash
cd weather-dashboard
```

### Step 3: Start a Local Web Server

```bash
python3 -m http.server 8000
```

### Step 4: Open the Application

Open the following address in your browser:

http://localhost:8000

Enter a city name and click Search to view weather information.

Alternatively, the index.html file can be opened directly in a web browser.

An internet connection is required to retrieve weather information from Open-Meteo.

## Deployment

The application was deployed using two Ubuntu web servers and one HAProxy load balancer provided through the ALU sandbox environment. I also connected my existing domain and configured HTTPS.

### Server Infrastructure

| Server | IP address | Technology | Purpose |
|---|---|---|---|
| Web01 | 18.133.239.146 | Ubuntu and Nginx | Hosts the application on port 8080 |
| Web02 | 35.177.254.240 | Ubuntu and Nginx | Hosts the application on port 8080 |
| LB01 | 3.8.101.245 | HAProxy | Handles HTTPS and distributes requests |

### Deployment Architecture

```text
               User's Browser
                     |
             HTTPS (Port 443)
                     |
           fanuelkangira.tech
                     |
                     v
              LB01 (HAProxy)
               3.8.101.245
                     |
               Round robin
             +-------+-------+
             |               |
        HTTP :8080      HTTP :8080
             |               |
             v               v
           Web01            Web02
           Nginx            Nginx
             |               |
             v               v
       Weather Dashboard  Weather Dashboard
```

HAProxy accepts the public HTTPS connection and forwards requests to one of the two Nginx web servers using round-robin load balancing. Both web servers host the same application files.

The browser communicates directly with the Open-Meteo API to retrieve weather information.

### Web Server Configuration

Nginx serves the application's static files on both Web01 and Web02.

Application directory:

```text
/var/www/weather-dashboard/
```

Each web server serves the application on port 8080.

### Custom Domain and DNS

I configured my existing domain, `fanuelkangira.tech`, to point to the load balancer. Both the root domain and the `www` subdomain resolve to `3.8.101.245`.

- Main website: https://fanuelkangira.tech
- Alternative website: https://www.fanuelkangira.tech
- Original load balancer endpoint: http://3.8.101.245:8080

The public A records for `web-01`, `web-02`, and `lb-01` also identify the corresponding servers.

### HTTPS Configuration

I used Let's Encrypt and Certbot to issue a certificate for both `fanuelkangira.tech` and `www.fanuelkangira.tech`. HAProxy uses the certificate to handle HTTPS connections on port 443. Requests sent to HTTP port 80 are redirected to HTTPS with status code 301.

The current certificate expires on **23 February 2027**.

### Automatic Certificate Renewal

Certbot has an active systemd timer to check certificate renewal. HAProxy forwards Let's Encrypt HTTP-01 verification requests to Certbot on localhost port 8888, so validation can run without stopping HAProxy.

After a successful renewal, a deployment hook updates HAProxy's certificate file and reloads HAProxy after checking the configuration. I tested the deployment hook manually and confirmed HAProxy remained active. I also ran:

```bash
sudo certbot renew --dry-run
```

The simulation successfully verified both domains. Certbot intentionally skipped the deployment hook during the dry run, so a future live renewal is not yet tested end to end.

### Load Balancer Verification

I tested HAProxy by sending six consecutive requests:

```bash
for i in {1..6}; do
    curl -sI https://fanuelkangira.tech | grep -i X-Served-By
done
```

The results alternated between the two servers:

```text
X-Served-By: 7204-web-01
X-Served-By: 7204-web-02
X-Served-By: 7204-web-01
X-Served-By: 7204-web-02
X-Served-By: 7204-web-01
X-Served-By: 7204-web-02
```

Each server handled three of the six requests. Both HTTPS domains also returned `HTTP 200 OK`. An HTTP request to the root domain returned `301 Moved Permanently`, redirecting to HTTPS.

### Infrastructure Test Results

| Test | Result |
|---|---|
| Root domain DNS points to LB01 | Passed |
| www domain DNS points to LB01 | Passed |
| HTTPS on both domains | Passed |
| HTTP to HTTPS redirection | Passed |
| HAProxy configuration validation | Passed |
| Round-robin load balancing | Passed — 3 requests per server |
| Manual certificate deployment hook | Passed |
| Certificate renewal dry run | Passed |

These tests were completed on **25 November 2026**. They verify the infrastructure but do not replace browser testing of all application features.

## Testing the Application

The following steps can be used to test the application:

1. Search for Kigali and check the current weather information.
2. Search for another city, such as Dar es Salaam.
3. Check the seven-day weather forecast.
4. Use the forecast filtering feature.
5. Check the maximum and minimum temperature chart.
6. Search for an invalid city and check the error message.
7. Repeat a city search to check caching behaviour.
8. Check the layout on different screen sizes.
9. Access the deployed application through HTTPS.
10. Check the responses from both web servers using the `X-Served-By` header.

## Video Demonstration

The video demonstration presents the application's main features, including weather search, forecasting, filtering, temperature visualization, error handling, caching, and deployment.

Watch the video on YouTube:

[Weather Dashboard Video Demonstration](https://youtu.be/VvYf9OWLsIk)

## Challenges and Lessons Learned

During this project, I gained practical experience working with external APIs, handling errors, managing application files, and configuring Linux servers.

I also learned how Nginx serves web applications and how HAProxy distributes requests between multiple servers. I learned how DNS connects a custom domain to a server, how HTTPS protects connections, and how Certbot and Let's Encrypt manage SSL certificates.

This project helped me understand how frontend development and web infrastructure work together to make an application accessible to users.

## Acknowledgements

- African Leadership University
- Open-Meteo for providing weather data and API services.
- Nginx and HAProxy for web hosting and load balancing.
- Let's Encrypt and Certbot for SSL certificate management.
- Git and GitHub for version control and source code management.

## Author

Fanuel Kangira

African Leadership University (ALU)

Course: Web Infrastructure

Project: Weather Dashboard

Year: 2026
