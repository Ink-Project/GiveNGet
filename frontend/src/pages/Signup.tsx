import { useState, useContext } from "react";
import { fetchHandler, getPostOptions } from "../utils/utils";
import CurrentUserContext from "../context/CurrentUserContext";
import { Link, useNavigate, Navigate } from "react-router-dom"
import { logUserIn } from "../adapters/auth-adapter";

const SignUp = () => {
  const navigate = useNavigate();
  const { currentUser ,setCurrentUser } = useContext(CurrentUserContext); // Getting current user context

  // users shouldn't be able to see the sign up page if they are already logged in.
  // if the currentUser exists in the context, navigate the user to profile page
  if (currentUser) return <Navigate to={`/users/${currentUser.id}`} />; 

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Function to handle input changes in the form fields
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'username') setUsername(value);
    if (name === 'password') setPassword(value);
  };

  // Function to handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Sending POST request to '/api/v1/users/' with form data using fetchHandler utility function
    await fetchHandler('/api/v1/users/', getPostOptions({ username, password }));
    const [user, error] = await logUserIn({ username: username, password: password }); // Logging in user
    if (error) {
      return "this did not work as expected"
    }
    setCurrentUser(user)
    navigate(`/users/${user.id}`); // After signing up, theyre taken to their profile page
  };

  return (
    <>
  <h1>Sign Up</h1>
  <br />
    <form onSubmit={handleSubmit}>
    <label htmlFor="user-input">Username:</label>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={username}
        onChange={handleChange}
      />
      <label htmlFor="password-input">Password:</label>
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={password}
        onChange={handleChange}
      />
      <button type="submit">Sign Up</button>
      <p>Already have an account with us? <Link to="/login">Log in!</Link></p>
    </form>
    </>
  );
};

export default SignUp;
