import React from 'react';
import './House.css'

function House({ house }) {
  const { price, address, homeowner, photoURL } = house
  const commaSeparatedPrice = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <>
      <div className="houseImage">
        <img src={photoURL} alt="houseImage" />
        <h3>${commaSeparatedPrice}</h3>
      </div>
      <h3>{address}</h3>
      <h4>Homeowner: {homeowner}</h4>
    </>
  )
}

export default House;
