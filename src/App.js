import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import './components/House/House.css';
// import LoadHouses from './containers/LoadHouses';
import House from './components/House/House';

const App = () => {
  const [loadMore, setLoadMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [housesPerPage] = useState(3);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    const fetchData = async (attemptsLeft) => {
      setLoading(true);
      setError(false);
      try {
        const API_URL = `http://app-homevision-staging.herokuapp.com/api_project/houses?page=${pageNumber}&per_page=${housesPerPage}`
        const res = await axios.get(API_URL)
        //this is now setUnfilteredHouses
        setHouses((prevHouses) => {
          return [...prevHouses, ...res.data.houses]
        })
        setLoadMore(false)
        setPageNumber((prevPageNumber) => prevPageNumber + 1)
      } catch (error) {
        if (attemptsLeft === 0) {
          setError(true)
          return
        };
        return await fetchData(attemptsLeft - 1);
      }

      setLoading(false);

      //check length of filtered houses (5)
      //call filterHouses(res.data.houses) (adds 2, now length is 7)
      //if filteredHouses array is not 10, call fetchData again
    };

    if (loadMore) fetchData(10);
  }, [loadMore])

  // Ref assigned to last house on page triggers an API call for next page of results
  const observer = useRef();
  const lastHouseElementRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setLoadMore(true);
      }
    })
    if (node) observer.current.observe(node)
  }, [loading]);

  return (
    <>
      <div className="container">
        <h1>HomeVision</h1>
        {houses &&
          <ul>
            {houses.map((house, index) => {
              if (index + 1 === houses.length) {
                return (
                  <li ref={lastHouseElementRef} key={house.id} className="houseListing">
                    <House house={house} />
                  </li>
                )
              }
              return (
                <li key={house.id} className="houseListing">
                  <House house={house} />
                </li>
              )
            })}
          </ul>
        }
        {!houses && <div>No houses available...</div>}
        {loading && <div className="loadingMessage">Loading...</div>}
        {error && <div className="errorMessage">ERROR</div>}
      </div>
    </>
  );
}

export default App;
