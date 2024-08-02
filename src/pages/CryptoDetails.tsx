import React, { useEffect, useState } from "react";
import axios from "axios";
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
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    setCurrentUser(storedUser);
  }, []);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await axios.get<CryptoData>(`https://api.binance.com/api/v3/ticker/24hr?symbol=${selectedSymbol}`);
        setCryptoData(response.data);
      } catch (error) {
        console.error("Error fetching crypto data:", error);
      }
    };

    fetchCryptoData();
  }, [selectedSymbol]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(storedFavorites);
    setIsFavorite(storedFavorites.includes(selectedSymbol));
  }, [selectedSymbol]);

  useEffect(() => {
    const fetchTop10Crypto = async () => {
      try {
        const response = await axios.get<CryptoData[]>('https://api.binance.com/api/v3/ticker/24hr');
        const top10Crypto = response.data
          .filter((crypto) => crypto.symbol.endsWith("USDT"))
          .sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume))
          .slice(0, 10)
          .map(crypto => crypto.symbol);
        setCryptoList(top10Crypto);
      } catch (error) {
        console.error("Error fetching top 10 cryptos:", error);
      }
    };

    fetchTop10Crypto();
  }, []);

  const handleSelect = (eventKey: string | null) => {
    if (eventKey) {
      setSelectedSymbol(eventKey);
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
      alert('Please log in to add favorites.');
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
                  <th scope="col">Price Change Percent</th>
                  <th scope="col">Weighted Avg Price</th>
                  <th scope="col">Prev Close Price</th>
                  <th scope="col">Last Price</th>
                  <th scope="col">Last Qty</th>
                  <th scope="col">Bid Price</th>
                  <th scope="col">Bid Qty</th>
                  <th scope="col">Ask Price</th>
                  <th scope="col">Ask Qty</th>
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
                            <Search />
                            {cryptoList.map((symbol) => (
                              <Dropdown.Item key={symbol} eventKey={symbol}>
                                {symbol}
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                  </td>
                  <td>{formatNumber(cryptoData.priceChange)}</td>
                  <td>{formatNumber(cryptoData.priceChangePercent)}</td>
                  <td>{formatNumber(cryptoData.weightedAvgPrice)}</td>
                  <td>{formatNumber(cryptoData.prevClosePrice)}</td>
                  <td>{formatNumber(cryptoData.lastPrice)}</td>
                  <td>{formatNumber(cryptoData.lastQty)}</td>
                  <td>{formatNumber(cryptoData.bidPrice)}</td>
                  <td>{formatNumber(cryptoData.bidQty)}</td>
                  <td>{formatNumber(cryptoData.askPrice)}</td>
                  <td>{formatNumber(cryptoData.askQty)}</td>
                  <td>{formatNumber(cryptoData.openPrice)}</td>
                  <td>{formatNumber(cryptoData.highPrice)}</td>
                  <td>{formatNumber(cryptoData.lowPrice)}</td>
                  <td>{formatNumber(cryptoData.volume)}</td>
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
