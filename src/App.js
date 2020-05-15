import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

import House from './components/House/House';
import homeVisionLogo from './static/home-vision-banner.png';
import './App.css';

const App = () => {
  const [loadMoreHouses, setLoadMoreHouses] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [housesPerPage] = useState(5);

  const [priceFilter, setPriceFilter] = useState({ filterMin: 0, filterMax: Infinity });
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
        const API_URL = `http://app-homevision-staging.herokuapp.com/api_project/houses?page=${pageNumber}&per_page=${housesPerPage}`;
        const res = await axios.get(API_URL);

        setHouses((prevHouses) => {
          return [...prevHouses, ...res.data.houses];
        });
        const priceFilteredHouses = res.data.houses.filter((house) => {
          return house.price >= priceFilter.filterMin && house.price <= priceFilter.filterMax;
        });
        setFilteredHouses((prevHouses) => {
          return [...prevHouses, ...priceFilteredHouses];
        });
      } catch (err) {
        if (attemptsLeft === 0) {
          setError(true);
          return;
        };
        return await fetchHouseData(attemptsLeft - 1);
      }

      setLoading(false);
      setLoadMoreHouses(false);
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
    };

    if (loadMoreHouses) fetchHouseData(10);
  }, [loadMoreHouses, pageNumber, housesPerPage, priceFilter]);

  // Update filtered houses on filter change.
  useEffect(() => {
    if (priceFilterApplied) {
      const newlyFilteredHouses = houses.filter((house) => {
        return house.price >= priceFilter.filterMin && house.price <= priceFilter.filterMax;
      });
      setFilteredHouses(newlyFilteredHouses);
    }
  }, [priceFilterApplied, priceFilter, houses]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    const commaSeparatedNumberRegex = /^[-+]?[0-9]+(?:,[0-9]{3})*(?:\.[0-9]+)?$/;

    if (commaSeparatedNumberRegex.test(value)) {
      const normalizedValue = value.replace(/,/g, '');
      setPriceFilter({ ...priceFilter, [name]: normalizedValue });
    } else {
      setPriceFilter({ ...priceFilter, [name]: name === 'filterMax' ? Infinity : 0 });
    }
  };

  const applyPriceFilter = (event) => {
    const { checked } = event.target;

    if (checked) {
      setPriceFilterApplied(true);
    } else {
      setPriceFilterApplied(false);
    }
  };

  // Infinite scroll - Ref assigned to last house in gallery triggers an API call to load more houses.
  const observer = useRef();
  const lastHouseElementRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setLoadMoreHouses(true);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading]);

  return (
    <div className="container">
      <a href="https://homevision.co/" target="_blank" rel="noopener noreferrer"><img className="homeVisionLogo" src={homeVisionLogo} alt="HomeVision Banner" /></a>
      <form className="priceFilter">
        <label>$<input type="text" name="filterMin" onChange={handleFilterChange} value={priceFilter.min} placeholder="min" /></label>
        <span>--</span>
        <label>$<input type="text" name="filterMax" onChange={handleFilterChange} value={priceFilter.max} placeholder="max" /></label>
        <label>Filter<input className="priceFilterCheckbox" type="checkbox" name="applyFilter" onChange={applyPriceFilter} /></label>
      </form>
      <section className="houseGallery">
        {priceFilterApplied ?
          <ul>
            {filteredHouses.map((house, index) => {
              /* Add ref to last house in gallery */
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
        {loading &&
          <div className="loadingMessage">
            <p>Loading...</p>
          </div>}
        {!houses &&
          <div className="errorMessage">
            <p>No more houses available...</p>
          </div>}
        {error &&
          <div className="errorMessage">
            <p>Server unavailable. Please try refreshing.</p>
          </div>}
      </section>
    </div>
  );
};

export default App;
