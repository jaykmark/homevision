import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import House from './components/House/House';

const App = () => {
  const [loadMore, setLoadMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [housesPerPage] = useState(3);

  const [priceFilterMin, setPriceFilterMin] = useState(0);
  const [priceFilterMax, setPriceFilterMax] = useState(200000);
  const [priceFilterApplied, setPriceFilterApplied] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [houses, setHouses] = useState([]);
  const [filteredHouses, setFilteredHouses] = useState([]);

  useEffect(() => {
    const fetchData = async (attemptsLeft) => {
      setLoading(true);
      setError(false);
      try {
        const API_URL = `http://app-homevision-staging.herokuapp.com/api_project/houses?page=${pageNumber}&per_page=${housesPerPage}`
        const res = await axios.get(API_URL)
        setHouses((prevHouses) => {
          return [...prevHouses, ...res.data.houses]
        })
        const priceFilteredHouses = res.data.houses.filter((house) => {
          return house.price >= priceFilterMin && house.price <= priceFilterMax
        })
        setFilteredHouses((prevHouses) => {
          return [...prevHouses, ...priceFilteredHouses]
        })

        setLoadMore(false)
        setPageNumber((prevPageNumber) => prevPageNumber + 1)
      } catch (err) {
        if (attemptsLeft === 0) {
          setError(true)
          return
        };
        return await fetchData(attemptsLeft - 1);
      }

      setLoading(false);
    };

    if (loadMore) fetchData(10);
  }, [loadMore])

  // Update filtered houses on filter change
  useEffect(() => {
    if (priceFilterApplied) {
      const newlyFilteredHouses = houses.filter((house) => {
        return house.price >= priceFilterMin && house.price <= priceFilterMax
      })
      setFilteredHouses(newlyFilteredHouses)
    }
  }, [priceFilterApplied])

  // Ref assigned to last house on page triggers an API call to load more houses
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

  const applyFilter = (event) => {
    if (event.target.checked) {
      setPriceFilterMin()
      setPriceFilterApplied(true)
    } else {
      setPriceFilterApplied(false)
    }
  }

  return (
    <div className="container">
      <h1>HomeVision</h1>
      <div className="priceFilter">
        <input type="text" name="filterMin" placeholder="min" />
        <input type="text" name="filterMax" placeholder="max" />
        <label>Filter<input type="checkbox" name="applyFilter" onChange={applyFilter} /></label>
      </div>
      <div className="houseGallery">
        {priceFilterApplied ?
          <ul>
            {filteredHouses.map((house, index) => {
              if (index + 1 === filteredHouses.length) {
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
          </ul> :
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
    </div>
  );
}

export default App;
