import "./App.css";
import NavBar from "./components/Nav";
import Posts from "./pages/Posts";
import Login from "./pages/Login";
import Inbox from "./pages/Inbox";
import Landing from "./pages/Landing";
import UsersPage from "./pages/User";
import EditProfilePage from "./pages/EditProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import { Routes, Route } from "react-router-dom";

function App() {

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/users/:id" element={<UsersPage />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
