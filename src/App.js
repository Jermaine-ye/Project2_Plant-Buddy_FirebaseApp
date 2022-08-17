import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect, createContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

// for import of components
import Registration from "./Components/Registration";
import Dashboard from "./Components/Dashboard";
import PlantInfo from "./Components/PlantInfo";
import PlantForm from "./Components/PlantForm";
import Community from "./Components/Community";
import Forums from "./Components/Forums";
import Recommendations from "./Components/Recommendations";
import AddPost from "./Components/AddPost";
import AddForumPost from "./Components/AddForumPost";

// for import of styles

export const UserContext = createContext();

function App() {
  const isLoggedIn = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(isLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    if (
      localStorage.getItem("user") === null ||
      localStorage.getItem("user") === undefined
    ) {
      localStorage.setItem("user", JSON.stringify({}));
    } else {
      if (Object.keys(isLoggedIn).length !== 0) {
        console.log(isLoggedIn);
      } else {
        localStorage.setItem("user", JSON.stringify(user));
        setUser(isLoggedIn);
        console.log("set user data LS");
      }
    }
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <UserContext.Provider value={user}>
          <Routes>
            <Route
              path="/login"
              element={<Registration handleLogin={setUser} />}
            ></Route>
            <Route path="/" element={<Dashboard />}></Route>
            <Route path="/plantprofile/:id" element={<PlantInfo />}></Route>
            <Route path="/addnewplant" element={<PlantForm />}></Route>
            <Route path="/community" element={<Community />}></Route>
            <Route path="/addnewpost" element={<AddPost />}></Route>
            <Route path="/forums" element={<Forums />}></Route>
            <Route path="/addnewforumpost" element={<AddForumPost />}></Route>
            <Route
              path="/recommendations"
              element={<Recommendations />}
            ></Route>
          </Routes>
        </UserContext.Provider>
      </header>
    </div>
  );
}

export default App;
