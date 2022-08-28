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
  isSameWeek,
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

//styling imports
import { Badge, Card, Container, Grid, Group, Text } from "@mantine/core";
import {
  ArrowBarToDown,
  ArrowLeft,
  ArrowRight,
  User,
} from "tabler-icons-react";

export default function PlantCalendar(props) {
  const [currDate, setCurrDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayOfWeekRender, setDayOfWeekRender] = useState(true);
  const [selectedDateRender, setSelectedDateRender] = useState(false);
  const [currMonth, setCurrMonth] = useState(new Date());
  const [currWeek, setCurrWeek] = useState(getWeek(currMonth));
  const [wateringSchedule, setWateringSchedule] = useState([]);
  const [dateLastWatered, setDateLastWatered] = useState([]);

  const user = props.user;

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

  useEffect(() => {
    setSelectedDate(new Date());
  }, []);

  useEffect(() => {
    if (currWeek == getWeek(new Date())) {
      setDayOfWeekRender(true);
    } else {
      setDayOfWeekRender(false);
    }
  });

  useEffect(() => {
    if (currWeek == getWeek(selectedDate)) {
      setSelectedDateRender(true);
    } else {
      setSelectedDateRender(false);
    }
  });

  const renderHeader = () => {
    const dateFormat = "MMM yyyy";
    return (
      <div>
        <Text size="xl">
          <span>
            <Text size="xs" underline>
              {format(currMonth, dateFormat)}
            </Text>
          </span>
        </Text>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = "eee";
    const days = [];
    let today = currDate.getDay();
    let startDate = startOfWeek(currDate);

    for (let i = 0; i < 7; i++) {
      let day = (
        <Text size="xs" weight="200">
          <div
            key={i}
            className={`${i == today && dayOfWeekRender ? "today-day" : null} ${
              selectedDate && selectedDateRender
                ? i == selectedDate.getDay()
                  ? "selected-day"
                  : null
                : null
            }`}
          >
            {format(addDays(startDate, i), dateFormat)}
          </div>
        </Text>
      );
      days.push(day);
    }
    return (
      // <Group position="center" spacing="xs" sx={{ width: "auto" }}>
      <Container sx={{ padding: "0px" }}>
        <div className={`calendar-row-day`}>
          {/* <Grid grow gutter="lg" sx={{ display: "inline-flex" }}> */}
          {days}
          {/* </Grid> */}
        </div>
      </Container>
      // </Group>
    );
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
        if (isSameDay(currDate, day)) {
          console.log("it is today");
          //setDayOfWeekRender(true);
        }
        days.push(
          <div
            className={`calendar-date-item ${
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
          console.log(plant);
          plantsToWater.push(plant);
        }
      }
      let wateringList = plantsToWater.map((plant, index) => {
        return (
          <div key={index} className="calendar-reminder-row">
            <Badge
              size="md"
              variant="dot"
              className="calendar-reminder-row-plant-badge"
            >
              {plant}
            </Badge>
          </div>
        );
      });
      return (
        <div className="calendar-date">
          <Text
            size="xs"
            align="left"
            underline
            sx={{ marginLeft: "2vw", marginTop: "5px", marginBottom: "5px" }}
          >
            {format(date, "d MMMM")}
          </Text>

          {wateringList.length > 0 ? wateringList : null}
        </div>
      );
    };

    return (
      <div>
        <div>
          <Container sx={{ padding: "0px" }}>
            {/* <Grid grow gutter="lg" sx={{ display: "inline-flex" }}> */}
            <div className="calendar-row-date">{days}</div>
            {/* </Grid> */}
          </Container>
        </div>

        {selectedDate ? <div>{selectedDateInfo(selectedDate)}</div> : null}
      </div>
    );
  };

  const changeWeek = (prevOrNext) => {
    //setSelectedDate(null);
    setDayOfWeekRender(false);
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
      <Card
        shadow="sm"
        radius="md"
        p="xs"
        sx={{
          width: "90vw",
          color: "#1f3b2c",
          margin: "auto",
        }}
      >
        <Text size="xs">
          Hello, {user.displayName}! These plants need watering.
        </Text>
        <div className="calendar-row">{renderHeader()}</div>
        <div className="calendar-row">{renderDays()}</div>
        <div className="calendar-row-info">{renderCells()}</div>
        <div className="calendar-row-buttons">
          <button
            className="remove-button button-left"
            onClick={() => changeWeek("prev")}
          >
            <ArrowLeft size="26" strokeWidth="0.5" color="black" />
          </button>
          <button className="remove-button" onClick={() => changeWeek("curr")}>
            <Text size="xs" underline>
              Current Week
            </Text>
          </button>
          <button
            className="remove-button button-right"
            onClick={() => changeWeek("next")}
          >
            <ArrowRight size="26" strokeWidth="0.5" color="black" />
          </button>
        </div>
      </Card>
    </div>
  );
}
