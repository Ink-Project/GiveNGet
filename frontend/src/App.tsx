import "./App.css";
import NavBar from "./components/NavBar"
import Posts from "./pages/Posts";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import Inbox from "./pages/Inbox";
import Landing from "./pages/Landing";
import UsersPage from "./pages/User"
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/users/:id" element={<UsersPage />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </>
  );
}

export default App;
