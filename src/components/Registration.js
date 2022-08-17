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

export default function Registration(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
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
      <div>
        <h1>Signup / Login</h1>
      </div>
      <form>
        <input
          type="text"
          placeholder="Email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <input
          type="submit"
          value="Signup"
          disabled={signedUp}
          onClick={(e) => {
            signup(e, email, password);
          }}
        />
        <input
          type="submit"
          value="Login"
          onClick={(e) => {
            login(e, email, password);
          }}
        />
      </form>
    </div>
  );
}
