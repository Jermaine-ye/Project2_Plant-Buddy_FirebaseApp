import logo from "./logo.svg";
import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";

// for import of components
<<<<<<< HEAD

=======
import Dashboard from "./components/Dashboard";
import PlantInfo from "./components/PlantInfo";
import PlantForm from "./components/PlantForm";
import Community from "./components/Community";
import Forums from "./components/Forums";
import Recommendations from "./components/Recommendations";
import AddPost from "./components/AddPost";
import AddForumPost from "./components/AddForumPost";
>>>>>>> main
// for import of styles

function App() {
  return (
    <div className="App">
<<<<<<< HEAD
      
=======
      <header className="App-header">
        <Routes>
          {/* <Route path="/" element={<Registration />}></Route> */}
          <Route path="/" element={<Dashboard />}></Route>
          <Route path="/plantprofile/:id" element={<PlantInfo />}></Route>
          <Route path="/addnewplant" element={<PlantForm />}></Route>
          <Route path="/community" element={<Community />}></Route>
          <Route path="/addnewpost" element={<AddPost />}></Route>
          <Route path="/forums" element={<Forums />}></Route>
          <Route path="/addnewforumpost" element={<AddForumPost />}></Route>
          <Route path="/recommendations" element={<Recommendations />}></Route>
        </Routes>
      </header>
>>>>>>> main
    </div>
  );
}

export default App;
