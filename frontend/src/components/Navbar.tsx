import { NavLink } from "react-router-dom";
import "./components.css";
import { useContext, useState } from "react";
import CurrentUserContext from "../context/CurrentUserContext";

const Navbar = () => {
  const [_inputValue, setInputValue] = useState("");
  const { currentUser } = useContext(CurrentUserContext);

  return (
    <div className="navbar">
      <NavLink className="link" to="/">
        {" "}
        Icon Goes Here{" "}
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
          <NavLink className="link" to="/login">
            {/* {" "} */}
            logout{" "}
          </NavLink>
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

export default Navbar;
