import { NavLink, useNavigate} from "react-router-dom";
import { useContext, useState } from "react";
import CurrentUserContext from "../context/CurrentUserContext";
import { logUserOut } from "../adapters/auth-adapter";
import { Navbar } from 'react-bootstrap'
import logo from "../images/logo.svg"
import "./components.css";

const Nav = () => {
  const navigate = useNavigate();
  const [_inputValue, setInputValue] = useState("");
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  const handleLogOut = async () => {
    logUserOut();
    setCurrentUser(null);
    navigate('/')
  };

  return (
    <div className="navbar">
      <NavLink className="link" to="/">
      <Navbar.Brand as={NavLink} to="/">
        <img className="logo" src={logo} alt="Logo" height="60" width="100%"/>
      </Navbar.Brand>
      </NavLink>
      {currentUser ? (
        <>
          <form className="form">
            <div className="form-items">
              <input
                className="item"
                type="text"
                placeholder="Search posts"
                onChange={(e) => setInputValue(e.target.value)}
                autoComplete="off"
              />
              <br />
              <button className="button" type="submit">
                Search
              </button>
            </div>
          </form>
          <nav className="page-links">
            <NavLink className="link" to="/posts">
              {" "}
              Posts{" "}
            </NavLink>
            <NavLink className="link" to="/inbox">
              {" "}
              Inbox{" "}
            </NavLink>
          </nav>
          <nav className="page-links">
          <button className="link" onClick={handleLogOut}>
            Log out</button>
        </nav>
        </>
      ) : (
        <nav className="page-links">
          <NavLink className="link" to="/login">
            {" "}
            Login{" "}
          </NavLink>
        </nav>
      )}
    </div>
  );
};

export default Nav;
