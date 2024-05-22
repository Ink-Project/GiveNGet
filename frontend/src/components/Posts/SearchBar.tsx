import React from "react";
import search from "../../images/search.svg";
import FilterComponent from "../FilterComponent";

type SearchBarProps = {
  searchTerm: string;
  onSearchInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

// const []

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchInputChange }) => {
  return (
    <>
      <div className="box">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={onSearchInputChange}
        />
        <label htmlFor="search">
          <img className="search-icon" src={search} alt="search logo" />
        </label>
      </div>
      <FilterComponent />
    </>
  );
};

export default SearchBar;
