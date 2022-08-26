import Calendar from "react-calendar";
//date-fns imports
import {
  addDays,
  addWeeks,
  differenceInCalendarDays,
  endOfMonth,
  endOfWeek,
  format,
  getWeek,
  isSameDay,
  parse,
  parseISO,
  parseJSON,
  startOfMonth,
  startOfWeek,
  subWeeks,
} from "date-fns";

//react imports
import { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";

//other imports
import "../App.css";
import { setLogLevel } from "firebase/app";

export default function PlantCalendar(props) {
  const [currDate, setCurrDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [currMonth, setCurrMonth] = useState(new Date());
  const [currWeek, setCurrWeek] = useState(getWeek(currMonth));
  const [wateringSchedule, setWateringSchedule] = useState([]);
  const [dateLastWatered, setDateLastWatered] = useState([]);

  const updateWateringSchedule = () => {
    let schedule = {};
    let dateWatered = {};
    for (let plantKey in props.plantData) {
      console.log("plant in props:", plantKey);
      console.log("plantName:", props.plantData[plantKey].plantName);
      let plantFamily = props.plantData[plantKey].plantFamily;
      let plantName = props.plantData[plantKey].plantName;
      let plantWaterFreq = Number(props.plantData[plantKey].waterFreqDay);
      schedule[plantName] = plantWaterFreq;

      let dateUserLastWatered = props.plantData[plantKey].dateLastWatered;
      dateWatered[plantName] = parseISO(dateUserLastWatered);
    }
    setWateringSchedule(schedule);
    setDateLastWatered(dateWatered);
  };
  // for checking if props.plantData loaded correctly
  useEffect(() => {
    console.log("plantdata:", props.plantData);

    // initialise watering schedule
    updateWateringSchedule();
  }, [selectedDate]);

  const renderHeader = () => {
    const dateFormat = "MMMM yyyy";
    return (
      <div>
        <span>{format(currMonth, dateFormat)}</span>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = "eee";
    const days = [];
    let startDate = startOfWeek(currDate);
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="calendar-row-item">
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div>{days}</div>;
  };

  const renderCells = () => {
    const startDate = startOfWeek(currMonth);
    const endDate = endOfWeek(currMonth);
    const dateFormat = "d";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const day1 = day;
        days.push(
          <div
            key={i}
            className={`calendar-row-item ${
              isSameDay(currDate, day) ? "today" : null
            } ${isSameDay(day, selectedDate) ? "selected-date" : null}`}
            onClick={() => {
              setSelectedDate(addDays(startDate, i));
              selectedDateInfo(addDays(startDate, i));
            }}
          >
            <span>{formattedDate}</span>
          </div>
        );
        day = addDays(day, 1);
      }
    }

    const selectedDateInfo = (date) => {
      let plantsToWater = [];
      for (let plant in dateLastWatered) {
        console.log(plant);
        const daysCalc = Math.abs(
          differenceInCalendarDays(dateLastWatered[plant], selectedDate)
        );
        console.log("watered plant:", dateLastWatered[plant]);
        console.log(daysCalc);
        if (daysCalc % wateringSchedule[plant] == 0) {
          plantsToWater.push(plant);
        }
      }
      return (
        <div>
          Selected {format(date, "d MMMM")}
          <br />
          {plantsToWater.length > 0
            ? `${plantsToWater} requires watering`
            : null}
        </div>
      );
    };

    return (
      <div>
        <div>{days}</div>
        <br />
        {selectedDate ? <div>{selectedDateInfo(selectedDate)}</div> : null}
      </div>
    );
  };

  const changeWeek = (prevOrNext) => {
    if (prevOrNext === "prev") {
      setCurrMonth(subWeeks(currMonth, 1));
      setCurrWeek(getWeek(subWeeks(currMonth, 1)));
    } else if (prevOrNext === "next") {
      setCurrMonth(addWeeks(currMonth, 1));
      setCurrWeek(getWeek(addWeeks(currMonth, 1)));
    } else if (prevOrNext === "curr") {
      setCurrMonth(new Date());
      setCurrWeek(getWeek(new Date()));
    }
  };

  return (
    <div>
      <div className="calendar-row">{renderHeader()}</div>
      <div className="calendar-row">{renderDays()}</div>
      <div className="calendar-row">{renderCells()}</div>
      <button onClick={() => changeWeek("prev")}>Previous Week</button>
      <button onClick={() => changeWeek("curr")}>Current Week</button>
      <button onClick={() => changeWeek("next")}>Next Week</button>
    </div>
  );
}
