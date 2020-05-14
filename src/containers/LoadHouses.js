import { useEffect, useState } from 'react';
import axios from 'axios';

export default function LoadHouses(loadMore, pageNumber, housesPerPage) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    const API_URL = `http://app-homevision-staging.herokuapp.com/api_project/houses?page=${pageNumber}&per_page=${housesPerPage}`

    const fetchData = async () => {
      setLoading(true);
      setError(false);

      try {
        const res = await axios.get(API_URL)
        setHouses((prevHouses) => {
          return [...prevHouses, ...res.data.houses]
        })
        setLoadMore(false)
      } catch (error) {
        setError(true);
      }

      setLoading(false);
    };

    if (loadMore) fetchData();
  }, [loadMore])

  return { loading, error, houses }
}
