import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


interface Crypto {
  symbol: string;
  price: string;
}

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cryptoData, setCryptoData] = useState<Crypto[]>([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(storedFavorites);
  }, []);

  useEffect(() => {
    if (favorites.length > 0) {
      axios.get('https://api.binance.com/api/v3/ticker/price')
        .then((response) => {
          const data = response.data.filter((crypto: Crypto) => favorites.includes(crypto.symbol));
          setCryptoData(data);
        })
        .catch((error) => {
          console.error('Error fetching crypto data:', error);
        });
    } else {
      setCryptoData([]);
    }
  }, [favorites]);

  const removeFavorite = (symbol: string) => {
    const updatedFavorites = favorites.filter((fav) => fav !== symbol);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  return (
    <div className="container">
      <h1 className="header-title">Your Favorites</h1>
      {cryptoData.length > 0 ? (
        <table className="table-custom">
          <thead>
            <tr>
              <th>Favorite</th>
              <th>Symbol</th>
              <th>Price</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {cryptoData.map((crypto) => (
              <tr key={crypto.symbol}>
                <td onClick={() => removeFavorite(crypto.symbol)}>
                  <i className={`bi ${favorites.includes(crypto.symbol) ? 'bi-star-fill' : 'bi-star'}`}></i>
                </td>
                <td>{crypto.symbol}</td>
                <td>${crypto.price}</td>
                <td>
                  <Link to={`/cryptoDetails/${crypto.symbol}`} className="btn btn-primary">Details</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-favorites">No favorites added.</p>
      )}
    </div>
  );
};

export default Favorites;
