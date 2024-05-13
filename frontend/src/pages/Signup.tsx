import React, { useState } from "react";
import { fetchHandler, getPostOptions } from "../utils";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // State for form data
    username: "",
    password: "",
  });

  // Function to handle input changes in the form fields
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Sending POST request to '/api/v1/users/' with form data using fetchHandler utility function
    await fetchHandler("/api/v1/users/", getPostOptions(formData));
    navigate("/"); // Navigating to home page after successful sign up
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
        <p>
          Already have an account with us? <Link to="/login">Log in!</Link>
        </p>
      </form>
    </>
  );
};

export default SignUp;
