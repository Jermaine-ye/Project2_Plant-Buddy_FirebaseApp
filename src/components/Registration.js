import { useState } from "react";
import { auth } from "../DB/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

//import styling
import registrationHeaderImg from "../styling/Drawkit Plants/Drawkit_06_World.png";
import { Button, Group, Input, Text } from "@mantine/core";

export default function Registration(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [showSignUpLogin, setShowSignUpLogin] = useState(false);
  const [signedUp, setSignedUp] = useState(false);

  const navigate = useNavigate();

  const signup = (e, email, password) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        updateProfile(user, { displayName: username });
        console.log(user);
        setUser(user);
        console.log("successfully signed up");
        props.handleLogin(user);
        setSignedUp(true);
      })

      .catch((error) => {
        console.log(error.code, error.message);
      });
  };
  const login = (e, email, password) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUser(user);
        console.log(user);
        navigate("/");
        props.handleLogin(user);
        localStorage.setItem("user", JSON.stringify(user));
        console.log("successfully logged in");
      })
      .catch((error) => {
        console.log(error.code, error.message);
      });
  };

  return (
    <div>
      <img
        className="community-header-img"
        src={registrationHeaderImg}
        alt={registrationHeaderImg}
      />
      <div>
        <Text size="xl" weight="bold">
          Bud-dy!
        </Text>
        <Text>Houseplant Community</Text>
      </div>
      <br />
      {!showSignUpLogin ? (
        <div>
          <Group position="center" spacing="xs" grow>
            <Button
              onClick={() => {
                setShowSignUpLogin(true);
              }}
            >
              Signup
            </Button>
            <Button
              onClick={() => {
                setShowSignUpLogin(true);
                setSignedUp(true);
              }}
            >
              Login
            </Button>
          </Group>
        </div>
      ) : null}

      {showSignUpLogin ? (
        <div>
          <form className="signup-form">
            <Input
              type="email"
              placeholder="Email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <Input
              type="password"
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            {!signedUp ? (
              <Input
                type="text"
                placeholder="Username"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            ) : null}
            {!signedUp ? (
              <div className="signup-button">
                <Button
                  onClick={(e) => {
                    signup(e, email, password);
                  }}
                >
                  Sign Up
                </Button>
              </div>
            ) : (
              <div className="signup-button">
                <Button
                  onClick={(e) => {
                    login(e, email, password);
                  }}
                >
                  Login
                </Button>
              </div>
            )}
          </form>
        </div>
      ) : null}
    </div>
  );
}
