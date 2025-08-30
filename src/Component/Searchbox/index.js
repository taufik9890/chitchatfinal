import React from "react";
import "./style.css";
import { BsSearch } from "react-icons/bs";

const Searchbox = () => {
  return (
    <>
      <div className="search-wrapper">
        <div className="search-icons">
          <BsSearch />
        </div>
        <div className="search-field">
          <input type="text" placeholder="Search here..." />
        </div>
      </div>
    </>
  );
};

export default Searchbox;
