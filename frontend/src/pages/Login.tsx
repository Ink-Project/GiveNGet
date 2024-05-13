import { useContext, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { logUserIn } from "../adapters/auth-adapter";
import CurrentUserContext from "../context/CurrentUserContext";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [errorText, setErrorText] = useState("");
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext); // Getting current user context

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setErrorText("");
    const formData = new FormData(event.target as HTMLFormElement);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const [user, error] = await logUserIn({ username, password }); // Logging in user
    if (error) {
      setErrorText(error.message); // Setting error message if login fails
      return false;
    }
    // Setting current user context
    setCurrentUser(user);

    // Navigating to user's profile page
    navigate(`/users/${user.id}`);
  };

  // Redirecting if user is already logged in
  if (currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} aria-labelledby="login-heading">
        <h2 id="login-heading">Log back in!</h2>
        <label htmlFor="username">Username</label>
        <input type="text" autoComplete="username" id="username" name="username" />

        <label htmlFor="password">Password</label>
        <input type="password" autoComplete="current-password" id="password" name="password" />

        <button>Log in!</button>
      </form>
      {errorText && <p>{errorText}</p>}
      <br />
      <Link className="sign-up-link" to="/signup">
        No Account? Sign Up Here
      </Link>
    </>
  );
}
