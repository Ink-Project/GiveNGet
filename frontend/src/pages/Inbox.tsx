const Inbox = () => {
  return (
    <div>
      <p>Your Inbox lies here</p>
      <table className ="table">
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
    
  ) 
};

export default Inbox;
