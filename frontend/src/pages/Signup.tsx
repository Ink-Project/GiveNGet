import React, { useState } from "react";
import { fetchHandler, getPostOptions } from "../utils";
import { Link, useNavigate } from "react-router-dom"

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Fetch using V1 
    await fetchHandler('/api/v1/users/', getPostOptions(formData));
    navigate('/')
    console.log("User signed up successfully!");
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
        value={formData.username}
        onChange={handleInputChange}
      />
      <label htmlFor="password-input">Password:</label>
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleInputChange}
      />
      <button type="submit">Sign Up</button>
      <p>Already have an account with us? <Link to="/login">Log in!</Link></p>
    </form>
    </>
  );
};

export default SignUp;
