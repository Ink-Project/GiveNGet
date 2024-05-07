import "./App.css";
import Navbar from "./components/Navbar";
import Posts from "./pages/Posts";
import Login from "./pages/Login";
import Inbox from "./pages/Inbox";
import Landing from "./pages/Landing";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </>
  );
}

export default App;
