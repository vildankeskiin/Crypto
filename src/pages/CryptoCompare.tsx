import React, { useEffect, useState } from "react";
import { Dropdown, Button } from "react-bootstrap";
import { CryptoData } from "../models/Crypto"; // Using the CryptoData model
import CryptoChart from "./CryptoChart"; // Component to display charts
import Search from "../components/Search"; // Search component
import './CryptoCompare.css';

const ComparePage: React.FC = () => {
  const [cryptoList, setCryptoList] = useState<string[]>([]);
  const [filteredCryptoList, setFilteredCryptoList] = useState<string[]>([]);
  const [selectedCryptos, setSelectedCryptos] = useState<string[]>([]);
  const [compareData, setCompareData] = useState<CryptoData[]>([]);

  // Fetching crypto data for dropdown
  useEffect(() => {
    const socket = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const availableCryptos = data
        .filter((item: any) => item.s.endsWith("USDT"))
        .sort((a: any, b: any) => parseFloat(b.v) - parseFloat(a.v)) // Sort by volume
        .slice(0, 10) // Top 10 cryptos
        .map((item: any) => item.s);
      
      setCryptoList(availableCryptos);
      setFilteredCryptoList(availableCryptos);
    };

    return () => {
      socket.close();
    };
  }, []);

  // Fetching selected cryptos data, but only update the selected ones
  useEffect(() => {
    const socket = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Sadece seçili kriptoların verilerini al
      const selectedData: CryptoData[] = data.filter((item: CryptoData) =>
        selectedCryptos.includes(item.s)
      );

      // seçili kriptoları güncelle
      setCompareData((prevData) => {
        const updatedData = [...prevData];

        selectedData.forEach((newCrypto: CryptoData) => {
          const index = updatedData.findIndex((crypto) => crypto.s === newCrypto.s);
          if (index !== -1) {
            updatedData[index] = newCrypto; // veriyi güncelle
          } else {
            updatedData.push(newCrypto); // veri yoksa yeni ekle
          }
        });

        return updatedData;
      });
    };

    return () => {
      socket.close();
    };
  }, [selectedCryptos]);

  // Function to handle crypto selection (limited to 2)
  const handleSelect = (eventKey: string | null) => {
    if (eventKey !== null && selectedCryptos.length < 2) {
      setSelectedCryptos([...selectedCryptos, eventKey]);
    }
  };

  // Function to remove selected crypto
  const handleRemoveCrypto = (symbol: string) => {
    setSelectedCryptos(selectedCryptos.filter((crypto) => crypto !== symbol));
    setCompareData(compareData.filter((crypto) => crypto.s !== symbol));
  };

  // Search function
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

  return (
    <div className="compare-container">
      <h1 className="header-title">Compare Cryptocurrencies</h1>

      <div className="dropdowns">
        <Dropdown onSelect={handleSelect}>
          <Dropdown.Toggle variant="success" id="dropdown-basic" disabled={selectedCryptos.length >= 2}>
            Select Cryptocurrency (Max 2)
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

      {/* Comparison Table */}
      {compareData.length > 0 && (
        <div className="table-container">
          <table className="table-custom">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Last Price</th>
                <th>Price Change</th>
                <th>Price Change Percentage</th>
                <th>Volume</th>
                <th>Remove</th> {/* Column for remove button */}
              </tr>
            </thead>
            <tbody>
              {compareData.map((crypto) => (
                <tr key={crypto.s}>
                  <td>{crypto.s}</td>
                  <td>{crypto.c}</td>
                  <td>{crypto.p}</td>
                  <td>{crypto.P}</td>
                  <td>{crypto.v}</td>
                  <td>
                    <Button variant="danger" onClick={() => handleRemoveCrypto(crypto.s)}>
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Display Charts for Selected Cryptos */}
      <div className="chart-section">
        {selectedCryptos.map((symbol) => (
          <div key={symbol} className="crypto-chart">
            <CryptoChart symbol={symbol} />
          </div>
        ))}
      </div>

      
    </div>
  );
};

export default ComparePage;
