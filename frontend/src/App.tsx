import "./App.css";
import Navbar from "./components/Navbar";
import Posts from "./pages/Posts";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import Inbox from "./pages/Inbox";
import Landing from "./pages/Landing";
import Users from "./pages/Users";
import { Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/users" element={<Users />} />
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
