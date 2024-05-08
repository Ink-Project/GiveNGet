import React, { useState } from "react";

const SignUp = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(`completed!`);
    setUserName("");
    setPassword("");
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <br />
      <form onSubmit={handleSubmit}>
        <label htmlFor="user-input">Username:</label>
        <input
          type="text"
          name="username"
          id="username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          autoComplete="off"
        />
        <label htmlFor="password-input">Password:</label>
        <input
          type="text"
          name="passcode"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="off"
        />
        <button>Submit</button>
      </form>
    </div>
  );
};
export default SignUp;
