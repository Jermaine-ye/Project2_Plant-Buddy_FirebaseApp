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
    // noonWeather: '',
    // nightWeather: '',
    // ntMornWeather: '',
    PeriodWeatherA: '',
    PeriodWeatherB: '',
    PeriodWeatherC: '',
    periodTimeA: '',
    periodTimeB: '',
    periodTimeC: '',
  });

  const [cityInputValue, setCityInputValue] = useState('Singapore');

  // const setWeatherIcon = () {

  const checkWeather = (input) => {
    switch (input) {
      case 'Thundery Showers':
        return <img src={thunder} alt="" width="50" height="50" />;
        break;
      case 'Cloudy':
        return <img src={overcast} alt="" width="50" height="50" />;
        break;
      case 'Partly Cloudy (Day)':
        return <img src={cloudyAM} alt="" width="50" height="50" />;
        break;
      case 'Partly Cloudy (Night)':
        return <img src={cloudyPM} alt="" width="50" height="50" />;
        break;
      case 'Passing Showers':
        return <img src={passingShower} alt="" width="50" height="50" />;
        break;
      case 'Showers':
        return <img src={passingShower} alt="" width="50" height="50" />;
        break;
      case 'Sunny':
        return <img src={sunny} alt="" width="50" height="50" />;
        break;
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

  // console.log(`Good ${timeOfDay()}!`);

  // function timeOfDay() {
  //   let hour = new Date().getHours();
  //   if (hour >= 4 && hour <= 11) return 'morning';
  //   if (hour >= 12 && hour <= 16) return 'afternoon';
  //   if (hour >= 17 && hour <= 20) return 'evening';
  //   if (hour >= 21 || hour <= 3) return 'night';
  // }

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

        // to create function to
        //get period time now to check against new date to determine m/n/n
        //extract start time, 3 data point pass into the newDate() (need to process data into timeinfo, not a string) date.parse etc.

        setWeatherInfo({
          mainWeather: currWeatherData,
          highTemp: currHighTemp,
          lowTemp: currLowTemp,
          PeriodWeatherA: weatherDataPeriod0,
          // noonWeather: { weatherDataNoon, period1Time },
          PeriodWeatherB: weatherDataPeriod1,
          PeriodWeatherC: weatherDataPeriod2,

          periodTimeA: period0Time,
          periodTimeB: period1Time,
          periodTimeC: period2Time,
          // mainWeather: response.data.items[0].general.forecast,
          // weatherDesc: weatherData.weather[0].description,
          // weatherIcon: weatherData.weather[0].icon,
        });
      });
  }, []);

  return (
    <div className="Weather-Modal">
      {/* <form onSubmit={handleSubmit}> */}
      {/* <input
          type="text"
          value={cityInputValue}
          onChange={handleChange}
          placeholder="Please enter a country!"
        /> */}

      {/* <input type="submit" value="Submit" />
      </form> */}
      <div className="Weather-Display">
        <h6>Country: {cityInputValue}</h6>
        <h6>Current Weather: {weatherInfo.mainWeather}</h6>
        {checkWeather(weatherInfo.mainWeather)}

        {/* {weatherInfo.mainWeather.includes('Showers') ? (
          <img src={thunder} alt="" width="50" height="50" />
        ) : null} */}

        <h6>
          Temperature highs: {weatherInfo.highTemp}°C lows:{' '}
          {weatherInfo.lowTemp}°C
        </h6>
        <h4>Forcasts</h4>
        <h6>
          {timeOfDay(weatherInfo.periodTimeA)}: {weatherInfo.PeriodWeatherA}
        </h6>
        {checkWeather(weatherInfo.PeriodWeatherA)}
        <h6>
          {timeOfDay(weatherInfo.periodTimeB)}: {weatherInfo.PeriodWeatherB}
        </h6>
        {checkWeather(weatherInfo.PeriodWeatherB)}
        <h6>
          {timeOfDay(weatherInfo.periodTimeC)}: {weatherInfo.PeriodWeatherC}
        </h6>
        {checkWeather(weatherInfo.PeriodWeatherC)}

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
