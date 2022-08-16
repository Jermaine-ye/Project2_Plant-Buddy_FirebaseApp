import { useState } from "react";
import { Link } from "react-router-dom";

export default function Dashboard(props) {
  // const [state, setState] = useState(state)

  let plantsInfo = [1, 2, 3, 4, 5, 6]; // REPLACE THIS WITH DATABASE PLANT PROFILES

  return (
    <div>
      <h1>DASHBOARD</h1>
      <div>
        <h3>Calendar placeholder</h3>
      </div>
      <div>
        <h3>Weather API placeholder</h3>
      </div>
      <div>
        Plant Profiles
        <ul>
          {plantsInfo.map((id) => {
            return (
              <li>
                <Link to={`/plantprofile/${id}`}>Plant {id}</Link>
              </li>
            );
          })}
        </ul>
      </div>
      <Link to={`/addnewplant`}>
        <button>Add A New Plant!</button>
      </Link>
      <div>
        <ul className="navigationBar">
          <li className="navigationBarItem">
            <Link to={"/community"}>Community</Link>
          </li>
          <li className="navigationBarItem">
            <Link to={"/forums"}>Forums</Link>
          </li>
          <li className="navigationBarItem">
            <Link to={"/recommendations"}>Recommendations</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
