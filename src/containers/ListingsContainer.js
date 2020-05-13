import React, { useState, useEffect } from 'react';
import axios from 'axios';

import House from '../components/House/House';

function ListingsContainer() {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [housesPerPage, setHousesPerPage] = useState(10);
  const API_URL = `http://app-homevision-staging.herokuapp.com/api_project/houses?page=${page}&per_page=${housesPerPage}`

  // Initial API call on page load
  useEffect(() => {
    const fetchData = async () => {
      setError(false);
      setLoading(true);

      try {
        const res = await axios(API_URL)
        setHouses([...houses, ...res.data.houses])
      } catch (error) {
        setError(true);
      }

      setLoading(false);
    };

    fetchData();
  }, [API_URL])

  return (
    <div className="houseList">
      <h1>Homevision</h1>
      {error && <div>WRONG</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
          <ul>
            {houses.map((house) => {
              return (
                <House house={house} key={house.id} />
              )
            })}
          </ul>
        )}
      <button onClick={() => setPage((prevPage) => prevPage + 1)}>Load More</button>
    </div>
  )
}

export default ListingsContainer;
