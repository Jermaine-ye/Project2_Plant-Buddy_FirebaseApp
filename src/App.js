import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect, createContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

// for import of components
import Registration from "./components/Registration";
import Dashboard from "./components/Dashboard";
import PlantInfo from "./components/PlantInfo";
import PlantForm from "./components/PlantForm";
import Community from "./components/Community";
import Forums from "./components/Forums";
import Recommendations from "./components/Recommendations";
import AddPost from "./components/AddPost";
import AddForumPost from "./components/AddForumPost";

// for import of styles

export const UserContext = createContext();

function App() {
  const [showAuthForm, setShowAuthForm] = useState(true);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  return (
    <div className="App">
      <header className="App-header">
        <UserContext.Provider value={user}>
          <Routes>
            <Route
              path="/login"
              element={
                <Registration
                  handleLogin={(user) => {
                    setUser(user);
                    console.log(user);
                  }}
                />
              }
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
