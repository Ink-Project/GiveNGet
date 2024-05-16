import CurrentUserContext from "../context/CurrentUserContext";
import { fetchHandler } from "../utils/utils";
import { Navigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { Container, Table } from "react-bootstrap";


const Inbox = () => {

  // Making sure that a user is logged in
  const { currentUser } = useContext(CurrentUserContext);
  if (!currentUser) return <Navigate to="/login" />;

  const [reservations, setReservations] = useState([]);

  const fetchResevation = async () => {
    const [data, error] = await fetchHandler("/api/v1/inbox");
    if (!error) {
      setReservations(data);
    }
  }

  useEffect(() => {
    fetchResevation();
    console.log(reservations);
  }, []);

  return (
    <>
    <h1>Inbox</h1>
    <Container>
      <Table className="mt-4">
      <thead className="table-dark">
    <tr>
      <th scope="col">Post_Id</th>
      <th scope="col"></th>
      <th scope="col">Confirmation</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
    </tr>
  </tbody>
      </Table>
    </Container>
    </>
  )
};

export default Inbox;


/* 
 <div>
      <p>Your Inbox lies here</p>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Item Name</th>
            <th scope="col">User</th>
            <th scope="col">Time Selected</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td scope="row">Couch</td>
            <td>Mark</td>
            <td> 3:15 pm</td>
          </tr>
          <tr>
            <td scope="row">Book</td>
            <td>Jacob</td>
            <td>6 am</td>
          </tr>
          <tr>
            <td scope="row">Toy</td>
            <td>Larry</td>
            <td>11:00 am</td>
          </tr>
        </tbody>
      </table>
    </div>

*/