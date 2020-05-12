import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ListingsContainer() {
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    const API_URL = 'http://app-homevision-staging.herokuapp.com/api_project/houses'
    axios.get(API_URL)
      .then((res) => setHouses(res.data.houses))
      .catch((err) => console.error(err))
  }, [])

  return (
    <div className="houseList">
      <h1>Homevision</h1>
      {houses.map((house) => {
        return (
          <div key={house.id}>
            <h2>{house.address}</h2>
          </div>
        )
      })}
    </div>
  )
}

export default ListingsContainer;
