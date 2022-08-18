import React, { useEffect, useState } from 'react';
import axios from 'axios';

import thunder from '../images/heavy-rain.png';
import overcast from '../images/cloud.png';
import cloudyAM from '../images/cloudy.png';
import cloudyPM from '../images/half-moon.png';
import passingShower from '../images/rain.png';
import sunny from '../images/sun.png';

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

  // const [cityInputValue, setCityInputValue] = useState('Singapore');

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
        return <img src={passingShower} alt="" width="50" height="50" />;

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
      // .then((response) => response.general[0])
      // .then((cityGeoData) =>
      //   axios.get(
      //     `https://api.openweathermap.org/data/2.5/weather?lat=${cityGeoData.lat}&lon=${cityGeoData.lon}&appid=35cb27b82fb9176679d18843496e02c4&units=metric`
      //   )
      // )
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

  return (
    <div className="Weather-Modal">
      <div className="Weather-Display">
        {/* <h6>Country: {cityInputValue}</h6> */}

        {/* {weatherInfo.mainWeather.includes('Showers') ? (
          <img src={thunder} alt="" width="50" height="50" />
        ) : null} */}
        <h6>Current Weather: {weatherInfo.mainWeather} </h6>
        <h6> {checkWeather(weatherInfo.mainWeather)}</h6>

        <h6>
          Temperature highs: {weatherInfo.highTemp}°C lows:{' '}
          {weatherInfo.lowTemp}
          °C
        </h6>
        <h4>Forcasts Every 6 Hours</h4>

        <h6>
          {timeOfDay(weatherInfo.periodTimeA)}: {weatherInfo.PeriodWeatherA}
          {checkWeather(weatherInfo.PeriodWeatherA)}
        </h6>

        <h6>
          {timeOfDay(weatherInfo.periodTimeB)}: {weatherInfo.PeriodWeatherB}
          {checkWeather(weatherInfo.PeriodWeatherB)}
        </h6>

        <h6>
          {timeOfDay(weatherInfo.periodTimeC)}: {weatherInfo.PeriodWeatherC}
          {checkWeather(weatherInfo.PeriodWeatherC)}
        </h6>

        {/* {weatherInfo.weatherIcon ? (
          <img
            src={`http://openweathermap.org/img/w/${weatherInfo.weatherIcon}.png`}
            alt="icon"
          /> */}

        {/* {weatherInfo.noonWeather === 'Passing Showers'
          ? setWeatherInfo({
              weatherIcon: weatherInfo.passingShowers,
            })
          : null} */}
      </div>
    </div>
  );
}
