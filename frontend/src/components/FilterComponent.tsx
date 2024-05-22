import { Container, Dropdown } from 'react-bootstrap';
import filter from "../images/filter.svg";

function FilterComponent() {
  return (
    <Container className="filter-contain d-flex justify-content-end">
      <Dropdown>
        <Dropdown.Toggle className="custom-dropdown-toggle" id="dropdown-filter">
          <img className="filter" src={filter} alt="filter button" />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Header>Sort Order</Dropdown.Header>
          <Dropdown.Item href="#/asc">Asc</Dropdown.Item>
          <Dropdown.Item href="#/desc">Desc</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Header>Limit</Dropdown.Header>
          <Dropdown.Item href="#/limit-1">1</Dropdown.Item>
          <Dropdown.Item href="#/limit-5">5</Dropdown.Item>
          <Dropdown.Item href="#/limit-10">10</Dropdown.Item>
          <Dropdown.Item href="#/limit-30">30</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Container>
  );
}

export default FilterComponent;
