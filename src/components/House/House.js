import React from 'react';
import './House.css'

function House({ house }) {
  const { id, price, address, homeowner, photoURL } = house

  return (
    <li key={id} className="houseListing">
      <div className="houseImage">
        <img src={photoURL} alt="houseImage" />
        ${price}
      </div>
      <h4>{address}</h4>
      <h5>Homeowner: {homeowner}</h5>
    </li>
  )
}

export default House;
