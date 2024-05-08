// import { useContext, useState, FormEvent } from "react";
// import { useNavigate, Navigate, Link } from "react-router-dom";
// import { logUserIn } from "../adapters/auth-adapter";
// import CurrentUserContext from "../context/CurrentUserContext";
import { Link } from "react-router-dom"

export default function LoginPage() {
//   const navigate = useNavigate();
//   const [errorText, setErrorText] = useState('');
//   const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

//   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setErrorText('');
//     const formData = new FormData(event.currentTarget);
//     const userData = Object.fromEntries(formData) as { username: string; password: string; };
//     const [user, error] = await logUserIn(userData);
//     if (error) return setErrorText(error.message);
//     setCurrentUser(user);
//     navigate(`/users/${user.id}`);
//   };

//   if (currentUser) return <Navigate to="/" />;

  return (
    <>
      <h1>Login</h1>
      <form aria-labelledby="login-heading">
        <h2 id='login-heading'>Log back in!</h2>
        <label htmlFor="username">Username</label>
        <input type="text" autoComplete="username" id="username" name="username" />

        <label htmlFor="password">Password</label>
        <input type="password" autoComplete="current-password" id="password" name="password" />

        <button>Log in!</button>
      </form>
      <br />
      <Link className="sign-up-link" to="/signup">
        No Account? Sign Up Here
      </Link>
    </>
  );
}
