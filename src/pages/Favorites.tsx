import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CryptoData } from '../models/Crypto';

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Retrieve favorite data from local storage
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(storedFavorites);
  }, []);

  useEffect(() => {
    if (favorites.length > 0) {
      const newSocket = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
      setSocket(newSocket);

      newSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        // Filter data to match favorites
        const filteredData: CryptoData[] = data
          .filter((crypto: CryptoData) => favorites.includes(crypto.s)) 
          .map((crypto: CryptoData) => ({
            ...crypto,
          }));

        // Merge with current data and only update favorite cryptos
        setCryptoData((prevData) => {
          const updatedData = [...prevData];

          filteredData.forEach((crypto: CryptoData) => {
            const index = updatedData.findIndex((item) => item.s === crypto.s);
            if (index !== -1) {
              updatedData[index] = crypto; // Update existing data
            } else {
              updatedData.push(crypto); // Add new data
            }
          });

          return updatedData;
        });
      };

      newSocket.onerror = (error) => {
        console.error('WebSocket Error:', error);
      };

      newSocket.onclose = () => {
        console.log('WebSocket connection closed');
        setTimeout(() => {
          const reconnectSocket = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
          setSocket(reconnectSocket);
        }, 5000);
      };

      return () => {
        newSocket.close();
      };
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
              <tr key={crypto.s}>
                <td onClick={() => removeFavorite(crypto.s)}>
                  <i className={`bi ${favorites.includes(crypto.s) ? 'bi-star-fill' : 'bi-star'}`}></i>
                </td>
                <td>{crypto.s}</td>
                <td>${crypto.c}</td>
                <td>
                  <Link to={`/cryptoDetails/${crypto.s}`} className="btn btn-primary">
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p > Loading... </p>
      )}
    </div>
  );
};

export default Favorites;
