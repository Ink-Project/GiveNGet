import CurrentUserContext from "../context/CurrentUserContext";
import { fetchHandler } from "../utils/utils";
import { Navigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { Container, Table } from "react-bootstrap";
import { Post } from "../utils/TypeProps";

type Reservation = {
  id: number;
  created_at: string;
  actor_id: string;
  event: string;
  post_id: number;
  post: Post;
  actor_name?: string;
}

const Inbox = () => {
  const { currentUser } = useContext(CurrentUserContext);
  if (!currentUser) return <Navigate to="/login" />;

  const [reservations, setReservations] = useState<Reservation[]>([]);

  // fetching reservation and post information
  const fetchData = async () => {
    const [data] = await fetchHandler("/api/v1/inbox");
    const reservationsWithPosts = await Promise.all(
      data.map(async (reservation: Reservation) => {
        const [post] = await fetchHandler(`/api/v1/posts/${reservation.post_id}`);
        return { ...reservation, post };
      })
    );
    setReservations(reservationsWithPosts);

    // Fetch users after setting reservations
    const updatedReservations = await Promise.all(
      reservationsWithPosts.map(async (reservation) => {
        const [user] = await fetchHandler(`/api/v1/users/${reservation.actor_id}`);
        return { ...reservation, actor_name: user.username };
      })
    );
    setReservations(updatedReservations);
  };

  useEffect(() => {
    fetchData();
  }, []); 

  return (
    <>
      <h1>Inbox</h1>
      <Container>
        <Table className="mt-4">
          <thead className="table-dark">
            <tr>
              <th scope="col">Post Name</th>
              <th scope="col">Created by</th>
              <th scope="col">Created At</th>
              <th scope="col">Confirmation</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id}>
                <td>{reservation.post.title}</td>
                <td>{reservation.actor_name}</td>
                <td>{new Date(reservation.created_at).toLocaleString()}</td>
                <td>{reservation.event}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default Inbox;
