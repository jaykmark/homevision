import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import House from '../components/House/House';

function ListingsContainer() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [houses, setHouses] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [housesPerPage, setHousesPerPage] = useState(5);

  // API call
  useEffect(() => {
    const API_URL = `http://app-homevision-staging.herokuapp.com/api_project/houses?page=${pageNumber}&per_page=${housesPerPage}`

    const fetchData = async () => {
      setLoading(true);
      setError(false);
      console.log(API_URL);

      try {
        const res = await axios.get(API_URL)
        setHouses((prevHouses) => {
          return [...prevHouses, ...res.data.houses]
        })
        console.log(houses);
      } catch (error) {
        setError(true);
      }

      setLoading(false);
    };

    fetchData();
  }, [pageNumber])

  return (
    <>
      <ul>
        {houses.map((house) => {
          return (
            <House house={house} key={house.id} />
          )
        })}
      </ul>
      <button onClick={() => setPageNumber((prevPage) => prevPage + 1)} className="loadMore">Load More</button>
      {loading && <div className="loadingMessage">Loading...</div>}
      {error && <div className="errorMessage">ERROR</div>}
    </>
  )
}

export default ListingsContainer;
