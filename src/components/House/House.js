import React from 'react';
import './House.css';

const House = ({ house }) => {
  const { price, address, homeowner, photoURL } = house;
  const commaSeparatedPrice = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <>
      <div className="houseImage">
        <img src={photoURL} alt="House" />
        <h3 className="housePrice">${commaSeparatedPrice}</h3>
      </div>
      <h3 className="houseAddress">{address}</h3>
      <h4 className="houseOwner">Homeowner: {homeowner}</h4>
    </>
  )
};

export default House;
