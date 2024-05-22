import React from 'react';
import { Container, Dropdown } from 'react-bootstrap';
import filter from "../images/filter.svg"

interface FilterComponentProps {
  onOrderChange: (order: string) => any;
  onLimitChange: (limit: number) => any;
}

const FilterComponent: React.FC<FilterComponentProps> = ({ onOrderChange, onLimitChange }) => {
  
  return (
    <Container className="filter-contain d-flex justify-content-end">
      <Dropdown>
        <Dropdown.Toggle className="custom-dropdown-toggle" id="dropdown-filter">
          <img className="filter" src={filter} alt="filter button" />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Header>Sort Order</Dropdown.Header>
          <Dropdown.Item onClick={() => onOrderChange('asc')}>Asc</Dropdown.Item>
          <Dropdown.Item onClick={() => onOrderChange('desc')}>Desc</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Header>Limit</Dropdown.Header>
          <Dropdown.Item onClick={() => onLimitChange(1)}>1</Dropdown.Item>
          <Dropdown.Item onClick={() => onLimitChange(5)}>5</Dropdown.Item>
          <Dropdown.Item onClick={() => onLimitChange(10)}>10</Dropdown.Item>
          <Dropdown.Item onClick={() => onLimitChange(30)}>30</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Container>
  );
};

export default FilterComponent;
