import React from "react";
import "./style.css";

const Rootcomponent = ({ item }) => {
  const { images, name, button } = item;
  return (
    <>
      <div className="root-wrapper">
        <div className="root-images">
          <picture>
            <img src={images} alt="profile" />
          </picture>
        </div>
        <div className="root-names">
          <h4>{name}</h4>
        </div>
        {button && (
          <div className="root-btn">
            <button type="button">{button}</button>
          </div>
        )}
      </div>
    </>
  );
};

export default Rootcomponent;
