import { useState } from "react";
import { auth } from "../DB/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Registration(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const signup = (e, email, password) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUser(user);
        navigate("/");
        console.log("successfully signed up");
        console.log(user);
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
        console.log("successfully logged in");
      })
      .catch((error) => {
        console.log(error.code, error.message);
      });
  };
  const logout = () => {
    setUser("");
    navigate("/");
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
          type="submit"
          value="Signup"
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
