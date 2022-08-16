import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PlantForm() {
  // form stuff goes here
  const navigate = useNavigate();
  const addInfo = () => {
    console.log("Info Added!");
  };

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
