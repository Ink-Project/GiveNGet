import { useState, useEffect } from "react";
import { fetchHandler } from "../utils";

interface User {
  id: number;
  username: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]); 

  useEffect(() => {
    fetchHandler('/api/users')
    setUsers(users)
  },[]);

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>
          <h1>Id: {user.id}</h1>
          <h2>{user.username}</h2>
        </div>
      ))}
    </div>
  );
};

export default Users;
