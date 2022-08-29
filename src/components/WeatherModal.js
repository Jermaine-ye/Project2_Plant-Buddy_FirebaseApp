import React, { useEffect, useState, forwardRef } from 'react';
import axios from 'axios';

import thunder from '../images/storm1.gif';
import overcast from '../images/cloudy1.gif';
import cloudyAM from '../images/cloudyam.gif';
import cloudyPM from '../images/cloudypm.gif';
import passingShower from '../images/downpour--v2.gif';
import sunny from '../images/sunny1.gif';

export default function WeatherModal() {
  const [weatherInfo, setWeatherInfo] = useState({
    mainWeather: '',
    weatherDesc: '',
    highTemp: '',
    lowTemp: '',
    PeriodWeatherA: '',
    PeriodWeatherB: '',
    PeriodWeatherC: '',
    periodTimeA: '',
    periodTimeB: '',
    periodTimeC: '',
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

        console.log(
          '6 hours: ' + response.data.items[0].periods[0].regions.central
        );
        console.log(
          '12 hours: ' + response.data.items[0].periods[1].regions.central
        );
        console.log(
          '18 hours: ' + response.data.items[0].periods[2].regions.central
        );

        const currWeatherData = response.data.items[0].general.forecast;
        const currHighTemp = response.data.items[0].general.temperature.high;
        const currLowTemp = response.data.items[0].general.temperature.low;

        const weatherDataPeriod0 =
          response.data.items[0].periods[0].regions.central;
        const weatherDataPeriod1 =
          response.data.items[0].periods[1].regions.central;
        const weatherDataPeriod2 =
          response.data.items[0].periods[2].regions.central;

        const period0Time = response.data.items[0].periods[0].time.start;
        console.log('P0: ' + period0Time);
        const period1Time = response.data.items[0].periods[1].time.start;
        console.log('P1: ' + period1Time);
        const period2Time = response.data.items[0].periods[2].time.start;
        console.log('P2: ' + period2Time);

        setWeatherInfo({
          mainWeather: currWeatherData,
          highTemp: currHighTemp,
          lowTemp: currLowTemp,
          PeriodWeatherA: weatherDataPeriod0,
          PeriodWeatherB: weatherDataPeriod1,
          PeriodWeatherC: weatherDataPeriod2,
          periodTimeA: period0Time,
          periodTimeB: period1Time,
          periodTimeC: period2Time,
        });
      });
  }, []);

  const WeatherModal = forwardRef((props, ref) => (
    <div ref={ref} {...props}>
      Weather Modal
    </div>
  ));

  return (
    <div className="weather-modal">
      {/* <h6>Current Weather: {weatherInfo.mainWeather} </h6>
      <h6> {checkWeather(weatherInfo.mainWeather)}</h6>

      <h6>
        Temperature highs: {weatherInfo.highTemp}°C lows: {weatherInfo.lowTemp}
        °C
      </h6> */}
      <h4>Forcasts Every 6 Hours</h4>

      <h6>
        {timeOfDay(weatherInfo.periodTimeA)}: {weatherInfo.PeriodWeatherA}
      </h6>
      {checkWeather(weatherInfo.PeriodWeatherA)}

      <h6>
        {timeOfDay(weatherInfo.periodTimeB)}: {weatherInfo.PeriodWeatherB}{' '}
      </h6>
      {checkWeather(weatherInfo.PeriodWeatherB)}

      <h6>
        {timeOfDay(weatherInfo.periodTimeC)}: {weatherInfo.PeriodWeatherC}
      </h6>
      {checkWeather(weatherInfo.PeriodWeatherC)}
      <br />
      <br />
    </div>
  );
}
