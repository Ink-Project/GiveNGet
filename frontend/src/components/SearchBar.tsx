import React from "react";
import { Form } from "react-bootstrap";

type SearchBarProps = {
  searchTerm: string;
  onSearchInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchInputChange }) => {
  return (
    <Form>
      <div className="form-floating">
        <Form.Control
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={onSearchInputChange}
        />
        <label htmlFor="search" className="form-label">
          Search
        </label>
      </div>
    </Form>
  );
};

export default SearchBar;
