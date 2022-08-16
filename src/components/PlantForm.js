import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";

export default function PlantForm() {
  // form stuff goes here
  const navigate = useNavigate();
  const addInfo = () => {
    console.log("Info Added!");
  };
  const user = useContext(UserContext);
  useEffect(() => {
    //check if user has logged in, if not, redirect them to login page
    if (Object.keys(user) == 0) {
      navigate("/login");
    }
  });

  return (
    <div>
      <h1>Add Plant Form</h1>
      <p>Some Text Here</p>
      <button
        onClick={() => {
          addInfo();
          navigate("/");
        }}
      >
        Add
      </button>
    </div>
  );
}
