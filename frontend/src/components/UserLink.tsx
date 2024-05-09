import { Link } from "react-router-dom";

type User = {
  id: string;
  username: string;
}

export default function UserLink({ user }: { user: User }) {
  return <Link to={`/users/${user.id}`}>{user.username}</Link>;
}
