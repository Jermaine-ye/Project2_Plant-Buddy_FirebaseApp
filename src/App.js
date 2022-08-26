import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect, createContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { database } from "./DB/firebase";
import { onChildChanged, ref as databaseRef } from "firebase/database";

// for import of components
import Registration from "./components/Registration";
import Dashboard from "./components/Dashboard";
import PlantInfo from "./components/PlantInfo";
import PlantForm from "./components/PlantForm";
import Community from "./components/Community";
import Post from "./components/CommunityPost";
import Forums from "./components/Forums";
import Recommendations from "./components/Recommendations";
import AddPost from "./components/AddPost";
import AddForumPost from "./components/AddForumPost";

// for import of styles
import { MantineProvider } from "@mantine/core";
import { buddyTheme } from "./Styles/Theme";
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Aside,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
} from "@mantine/core";

export const UserContext = createContext();

function App() {
  const isLoggedIn = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(isLoggedIn);
  const navigate = useNavigate();

  const [opened, setOpened] = useState(false);

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
      <MantineProvider withGlobalStyles withNormalizeCSS theme={buddyTheme}>
        <AppShell
          styles={{
            main: {
              background: buddyTheme.colors.seashell[3],
            },
          }}
          navbarOffsetBreakpoint="sm"
          // asideOffsetBreakpoint="sm"
          navbar={
            <Navbar
              p="md"
              hiddenBreakpoint="sm"
              hidden={!opened}
              width={{ sm: 200, lg: 300 }}
            >
              <Text>Application navbar</Text>
            </Navbar>
          }
          // aside={
          //   <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
          //     <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
          //       <Text>Application sidebar</Text>
          //     </Aside>
          //   </MediaQuery>
          // }
          // footer={
          //   <Footer height={60} p="md">
          //     Application footer
          //   </Footer>
          // }
          header={
            <Header height={70} p="md">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                  backgroundColor: buddyTheme.colors.moss[4],
                }}
              >
                <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                  <Burger
                    opened={opened}
                    onClick={() => setOpened((o) => !o)}
                    size="sm"
                    color={buddyTheme.colors.moss}
                    mr="xl"
                  />
                </MediaQuery>

                <Text>Application header</Text>
              </div>
            </Header>
          }
        >
          <UserContext.Provider value={user}>
            <Routes>
              <Route
                path="/login"
                element={<Registration handleLogin={setUser} />}
              ></Route>
              <Route path="/" element={<Dashboard />}></Route>
              <Route path="/plantprofile" element={<PlantInfo />}></Route>
              <Route path="/addnewplant" element={<PlantForm />}></Route>
              <Route path="/community" element={<Community />}></Route>
              <Route path="community/posts/:id" element={<Post />}></Route>
              <Route path="/addnewpost" element={<AddPost />}></Route>
              <Route path="/forums" element={<Forums />}></Route>
              <Route path="/addnewforumpost" element={<AddForumPost />}></Route>
              <Route
                path="/recommendations"
                element={<Recommendations />}
              ></Route>
            </Routes>
          </UserContext.Provider>
        </AppShell>
      </MantineProvider>
    </div>
  );
}

export default App;
