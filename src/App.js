import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import House from './components/House/House';
import homeVisionLogo from './static/home-vision-banner.png'

const App = () => {
  const [loadMore, setLoadMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [housesPerPage] = useState(10);

  const [priceFilter, setPriceFilter] = useState({ filterMin: 0, filterMax: Infinity })
  const [priceFilterApplied, setPriceFilterApplied] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [houses, setHouses] = useState([]);
  const [filteredHouses, setFilteredHouses] = useState([]);

  // API call to load houses.
  useEffect(() => {
    const fetchHouseData = async (attemptsLeft) => {
      setLoading(true);
      setError(false);
      try {
        const API_URL = `http://app-homevision-staging.herokuapp.com/api_project/houses?page=${pageNumber}&per_page=${housesPerPage}`
        const res = await axios.get(API_URL)
        setHouses((prevHouses) => {
          return [...prevHouses, ...res.data.houses];
        })
        const priceFilteredHouses = res.data.houses.filter((house) => {
          return house.price >= priceFilter.filterMin && house.price <= priceFilter.filterMax;
        })
        setFilteredHouses((prevHouses) => {
          return [...prevHouses, ...priceFilteredHouses];
        })

        setLoadMore(false)
        setPageNumber((prevPageNumber) => prevPageNumber + 1)
      } catch (err) {
        if (attemptsLeft === 0) {
          setError(true)
          return
        };
        return await fetchHouseData(attemptsLeft - 1);
      }

      setLoading(false);
    };

    if (loadMore) fetchHouseData(10);
  }, [loadMore])

  // Update filtered houses on filter change.
  useEffect(() => {
    if (priceFilterApplied) {
      const newlyFilteredHouses = houses.filter((house) => {
        return house.price >= priceFilter.filterMin && house.price <= priceFilter.filterMax;
      })
      setFilteredHouses(newlyFilteredHouses)
    }
  }, [priceFilter, priceFilterApplied])

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    // Set non-number inputs to default filter value.
    if (isNaN(value) || value === '') {
      setPriceFilter({ ...priceFilter, [name]: name === 'filterMax' ? Infinity : 0 })
      console.log(priceFilter);
    } else {
      setPriceFilter({ ...priceFilter, [name]: value })
      console.log(priceFilter);
    }
  }

  const applyPriceFilter = (event) => {
    if (event.target.checked) {
      setPriceFilterApplied(true)
    } else {
      setPriceFilterApplied(false)
    }
  }

  // Infinite Scroll - Ref assigned to last house in gallery triggers an API call to load more houses.
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
    <div className="container">
      <img className="homeVisionLogo" src={homeVisionLogo} alt="HomeVision Banner" />
      <div className="priceFilter">
        <input type="text" name="filterMin" onChange={handleFilterChange} value={priceFilter.min} placeholder="min" />
        <span>-</span>
        <input type="text" name="filterMax" onChange={handleFilterChange} value={priceFilter.max} placeholder="max" />
        <label>Filter<input type="checkbox" name="applyFilter" onChange={applyPriceFilter} /></label>
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
        {!houses &&
          <div className="errorMessage">
            <p>No houses available...</p>
          </div>}
        {loading &&
          <div className="loadingMessage">
            <p>Loading...</p>
          </div>}
        {error &&
          <div className="errorMessage">
            <p>Server unavailable. Please try refreshing.</p>
          </div>}
      </div>
    </div>
  );
}

export default App;
