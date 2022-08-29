import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Title } from '@mantine/core';

import thunder from '../images/storm1.gif';
import overcast from '../images/cloudy1.gif';
import cloudyAM from '../images/cloudyam.gif';
import cloudyPM from '../images/cloudypm.gif';
import passingShower from '../images/downpour--v2.gif';
import sunny from '../images/sunny1.gif';

export default function WeatherDisplay() {
  const [weatherInfo, setWeatherInfo] = useState({
    mainWeather: '',
    weatherDesc: '',
    highTemp: '',
    lowTemp: '',
  });

  const checkWeather = (input) => {
    switch (input) {
      case 'Thundery Showers':
        return <img src={thunder} alt="" width="50" height="50" />;

      case 'Cloudy':
        return <img src={overcast} alt="" width="50" height="50" />;

      case 'Partly Cloudy (Day)':
        return <img src={cloudyAM} alt="" width="50" height="50" />;

      case 'Partly Cloudy (Night)':
        return <img src={cloudyPM} alt="" width="50" height="50" />;

      case 'Passing Showers':
        return <img src={passingShower} alt="" width="50" height="50" />;

      case 'Showers':
        return <img src={thunder} alt="" width="50" height="50" />;

      case 'Sunny':
        return <img src={sunny} alt="" width="50" height="50" />;

      default:
        return null;
    }
  };

  const timeOfDay = (input) => {
    let hour = new Date(input).getHours();
    if (hour >= 4 && hour <= 11) return 'Morning';
    if (hour >= 12 && hour <= 16) return 'Afternoon';
    if (hour >= 17 && hour <= 20) return 'Evening';
    if (hour >= 21 || hour <= 3) return 'Night';
  };

  useEffect(() => {
    console.log('submit success!');
    axios
      .get(`https://api.data.gov.sg/v1/environment/24-hour-weather-forecast`)

      .then((response) => {
        console.log(response);
        console.log('curr: ' + response.data.items[0].general.forecast);
        console.log(
          'curr low temp : ' + response.data.items[0].general.temperature.low
        );
        console.log(
          'curr high temp : ' + response.data.items[0].general.temperature.high
        );

        console.log(response.data.items[0]);

        const currWeatherData = response.data.items[0].general.forecast;
        const currHighTemp = response.data.items[0].general.temperature.high;
        const currLowTemp = response.data.items[0].general.temperature.low;

        setWeatherInfo({
          mainWeather: currWeatherData,
          highTemp: currHighTemp,
          lowTemp: currLowTemp,
        });
      });
  }, []);

  return (
    <div className="weather-display">
      {checkWeather(weatherInfo.mainWeather)}

      <br />

      <Title class="weather-info" size={9} align="left">
        {weatherInfo.mainWeather}
        <br /> highs: {weatherInfo.highTemp}°C <br />
        lows: {weatherInfo.lowTemp}
        °C
      </Title>
    </div>
  );
}
