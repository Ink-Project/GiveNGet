import React, { useContext, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { logUserIn } from "../adapters/auth-adapter";
import CurrentUserContext from "../context/CurrentUserContext";
import log from "../images/log.svg";
import register from "../images/register.svg";
import { createUser } from "../adapters/user-adapter";
import "../css/Login.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [errorText, setErrorText] = useState("");
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const toggleMode = () => {
    setIsSignUpMode((prevMode) => !prevMode);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "fullName") setFullName(value);
    if (name === "username") setUsername(value);
    if (name === "password") setPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
  };

  const handleSignUpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorText("");

    // Add client-side validation for password match
    if (password !== confirmPassword) {
      setErrorText("Passwords do not match");
      return;
    }

    const [user, error] = await createUser({ full_name: fullName, username, password });
    if (error) {
      setErrorText(error.message);
      return;
    }
    setCurrentUser(user);
    navigate(`/users/${user.id}`);
  };

  const handleLogInSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setErrorText("");
    const formData = new FormData(event.target as HTMLFormElement);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const [user, error] = await logUserIn({ username, password });
    if (error) {
      setErrorText(error.message);
      return;
    }
    setCurrentUser(user);
    navigate(`/users/${user.id}`);
  };

  if (currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <div className={`contain ${isSignUpMode ? "sign-up-mode" : ""}`}>
      <div className="forms-container">
        <div className="signin-signup">
          <form onSubmit={handleLogInSubmit} className="sign-in-form">
            <h2 className="title">Sign in</h2>
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input type="text" name="username" placeholder="Username" required className="form-control" />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input type="password" name="password" placeholder="Password" required className="form-control" />
            </div>
            <input type="submit" value="Login" className="btn-solid" />
            {errorText && <p className="error-text">{errorText}</p>}
          </form>
          <form onSubmit={handleSignUpSubmit} className="sign-up-form">
            <h2 className="title">Sign up</h2>
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={fullName}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={username}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleChange}
                className="form-control"
                required
              />
              {password !== confirmPassword && <div className="invalid-feedback">Passwords do not match</div>}
            </div>
            <input type="submit" className="btn" value="Sign up" />
            {errorText && <p className="error-text">{errorText}</p>}
          </form>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New here ?</h3>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis, ex ratione.
              Aliquid!
            </p>
            <button className="btn transparent" onClick={toggleMode}>
              Sign up
            </button>
          </div>
          <img src={log} className="image" alt="Sign In" />
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>One of us ?</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum laboriosam ad
              deleniti.
            </p>
            <button className="btn transparent" onClick={toggleMode}>
              Sign in
            </button>
          </div>
          <img src={register} className="image" alt="Sign Up" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
