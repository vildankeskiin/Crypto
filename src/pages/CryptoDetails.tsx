import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CryptoData } from "../models/Crypto";
import CryptoChart from "./CryptoChart";
import { Dropdown, Button } from "react-bootstrap";
import Search from "../components/Search";

const CryptoDetails: React.FC = () => {
  const { symbol: urlSymbol } = useParams<{ symbol: string }>();
  const [cryptoData, setCryptoData] = useState<CryptoData | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<string>(urlSymbol || 'BTCUSDT');
  const [isFavorite, setIsFavorite] = useState(false);
  const [cryptoList, setCryptoList] = useState<string[]>([]);
  const [filteredCryptoList, setFilteredCryptoList] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setSelectedSymbol(urlSymbol || 'BTCUSDT');
  }, [urlSymbol]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    setCurrentUser(storedUser);
  }, []);

  useEffect(() => {
    const socket = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const crypto = data.find((item: any) => item.s === selectedSymbol);
      if (crypto) {
        setCryptoData(crypto);
      }

      // Filter and sort the top 10 highest-volume cryptocurrencies
      const availableCryptos = data
        .filter((item: any) => item.s.endsWith("USDT"))
        .sort((a: any, b: any) => parseFloat(b.v) - parseFloat(a.v)) // Sort by volume
        .slice(0, 10) // Take the top 10
        .map((item: any) => item.s);
      
      setCryptoList(availableCryptos);
      setFilteredCryptoList(availableCryptos);
    };

    socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      socket.close();
    };
  }, [selectedSymbol]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(storedFavorites);
    setIsFavorite(storedFavorites.includes(selectedSymbol));
  }, [selectedSymbol]);

  const handleSelect = (eventKey: string | null) => {
    if (eventKey) {
      setSelectedSymbol(eventKey);
    }
  };

  const handleSearch = (query: string) => {
    if (query) {
      const filteredList = cryptoList.filter((symbol) =>
        symbol.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCryptoList(filteredList);
    } else {
      setFilteredCryptoList(cryptoList);
    }
  };

  const toggleFavorite = (symbol: string) => {
    if (currentUser) {
      let updatedFavorites: string[];
      if (favorites.includes(symbol)) {
        updatedFavorites = favorites.filter((fav) => fav !== symbol);
      } else {
        updatedFavorites = [...favorites, symbol];
      }
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } else {
      alert('Please log in to add to favorites.');
    }
  };

  const formatNumber = (num: string) => {
    return parseFloat(num).toString();
  };

  return (
    <div className="detail-container">
      {cryptoData ? (
        <>
          <div className="table-container">
            <table className="table-custom">
              <thead>
                <tr>
                  <th scope="col">Symbol</th>
                  <th scope="col">Price Change</th>
                  <th scope="col">Price Change Percentage</th>
                  <th scope="col">Weighted Avg Price</th>
                  <th scope="col">Previous Close Price</th>
                  <th scope="col">Last Price</th>
                  <th scope="col">Last Quantity</th>
                  <th scope="col">Bid Price</th>
                  <th scope="col">Bid Quantity</th>
                  <th scope="col">Ask Price</th>
                  <th scope="col">Ask Quantity</th>
                  <th scope="col">Open Price</th>
                  <th scope="col">High Price</th>
                  <th scope="col">Low Price</th>
                  <th scope="col">Volume</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div style={{ display: 'flex' }}>
                      <div style={{ width: '200px' }}>
                        <Dropdown onSelect={handleSelect}>
                          <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {selectedSymbol}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Search onSearch={handleSearch} />
                            {filteredCryptoList.map((symbol) => (
                              <Dropdown.Item key={symbol} eventKey={symbol}>
                                {symbol}
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                  </td>
                  <td>{formatNumber(cryptoData.p)}</td>
                  <td>{formatNumber(cryptoData.P)}</td>
                  <td>{formatNumber(cryptoData.w)}</td>
                  <td>{formatNumber(cryptoData.x)}</td>
                  <td>{formatNumber(cryptoData.c)}</td>
                  <td>{formatNumber(cryptoData.Q)}</td>
                  <td>{formatNumber(cryptoData.b)}</td>
                  <td>{formatNumber(cryptoData.B)}</td>
                  <td>{formatNumber(cryptoData.a)}</td>
                  <td>{formatNumber(cryptoData.A)}</td>
                  <td>{formatNumber(cryptoData.o)}</td>
                  <td>{formatNumber(cryptoData.h)}</td>
                  <td>{formatNumber(cryptoData.l)}</td>
                  <td>{formatNumber(cryptoData.v)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <CryptoChart symbol={selectedSymbol} />
          <div className="button-container">
            <Button onClick={() => toggleFavorite(selectedSymbol)}>
              <i className={`bi ${favorites.includes(selectedSymbol) ? 'bi-star-fill' : 'bi-star'}`}></i>
              {favorites.includes(selectedSymbol) ? 'Remove from favorites' : 'Add to favorites'}
            </Button>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CryptoDetails;
