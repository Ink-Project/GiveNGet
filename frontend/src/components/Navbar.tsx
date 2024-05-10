import { useNavigate, NavLink} from "react-router-dom";
import { logUserOut } from "../adapters/auth-adapter";
import { useContext } from "react";
import CurrentUserContext from "../context/CurrentUserContext";
import { Navbar, Nav, Container , Dropdown } from 'react-bootstrap'
import logo from "../images/logo.svg"
import user from "../images/user.svg"
import "./components.css";

const NavBar = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const { id } = currentUser || {};

  const handleLogOut = async () => {
    logUserOut();
    setCurrentUser(null);
    navigate('/');
  }

  return (
    <Navbar className='white shadow-lg mb-3'>
      <Container>
        <Navbar.Brand to="/" as={NavLink}>
          <img className='logo' src={logo} alt="Logo" height="60" width="100%"/>  
        </Navbar.Brand>
        <Nav className="ms-auto align-items-center">
          {currentUser ? (
            <>
              <Nav.Link to="/posts" as={NavLink}>Posts</Nav.Link>
              <Nav.Link to="/inbox" as={NavLink}>Inbox</Nav.Link>
              <Dropdown>
                <Dropdown.Toggle variant="outline primary">
                  <img style={{ width: '3rem', height: '4rem'}} src={user} alt="user image" />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item to={`/users/${id}`} as={NavLink}>Profile</Dropdown.Item>
                  <Dropdown.Item onClick={handleLogOut}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          ) : (
            <Dropdown>
              <Dropdown.Toggle variant="outline primary">
                <img style={{ width: '3rem', height: '4rem'}} src={user} alt="user image" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={NavLink} to="/login">Login</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Nav>
      </Container>
    </Navbar>
  );  
};

export default NavBar;
