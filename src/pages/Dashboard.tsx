import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Dashboard.css';
import { Link } from 'react-router-dom';
import { CryptoData } from '../models/Crypto';
import './Theme.css';
import coinImage from '../assets/coin.png';

const Dashboard: React.FC = () => {

    const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isAscending, setIsAscending] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [logos, setLogos] = useState<{ [key: string]: string }>({}); 

    useEffect(() => {
        const socket = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
        socket.onmessage = (event) => {
            try {
                const data: CryptoData[] = JSON.parse(event.data);

                // Filter only USDT pairs
                let filteredData = data.filter((crypto) => crypto.s.endsWith("USDT"));

                // Take the first 10 items
                filteredData = filteredData
                    .sort((a, b) => parseFloat(b.v) - parseFloat(a.v)) // Sort by volume
                    .slice(0, 10); // Take the top 10

                // Sort data based on sort order
                filteredData = filteredData.sort((a, b) => {
                    return isAscending
                        ? parseFloat(a.v) - parseFloat(b.v)
                        : parseFloat(b.v) - parseFloat(a.v);
                });

                setCryptoData(filteredData);
            } catch (error) {
                console.error('Error processing WebSocket message:', error);
            }
        };

        socket.onopen = () => {
            console.log('WebSocket connection opened.');
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed.');
        };

        const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        setCurrentUser(currentUser);

        const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setFavorites(storedFavorites);

        return () => {
            socket.close();
        };
    }, [isAscending]);



    useEffect(() => {
        // Fetch coin logos from Coingecko API
        const fetchLogos = async () => {
            try {
                const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd');
                const data = await response.json();

                const logoMap: { [key: string]: string } = {};
                data.forEach((coin: any) => {
                    logoMap[coin.symbol.toUpperCase()] = coin.image; // Store coin logos in a map
                });
                setLogos(logoMap);
            } catch (error) {
                console.error('Error fetching logo data:', error);
            }
        };
        fetchLogos();
    }, []);

    const toggleFavorite = (symbol: string) => {
        if (!currentUser) {
            alert('Please log in to add favorites.');
            return;
        }

        const updatedFavorites = favorites.includes(symbol)
            ? favorites.filter((fav) => fav !== symbol)
            : [...favorites, symbol];

        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    const toggleSortOrder = () => {
        setIsAscending(!isAscending);
    };

 
    const getLogo = (symbol: string) => {
        return logos[symbol] || coinImage; 
    };



    
    // Function to determine the color based on price change
    const getPriceChangeClass = (priceChange: string) => {
        const changeValue = parseFloat(priceChange);
        if (changeValue > 0) {
            return 'text-success'; // Yeşil renk
        } else if (changeValue < 0) {
            return 'text-danger'; // Kırmızı renk
        } else {
            return ''; // Renk yok
        }
    };

    return (
        <div className='container'>
            <h1 className="header-title">Top 10 Cryptocurrencies by Volume</h1>
            <div className="view-toggle-buttons">
                <button 
                    className={viewMode === 'list' ? 'active' : ''} 
                    onClick={() => setViewMode('list')}
                >
                    List View
                </button>
                <button 
                    className={viewMode === 'grid' ? 'active' : ''} 
                    onClick={() => setViewMode('grid')}
                >
                    Grid View
                </button>

                <button 
                    className="sort-button"
                    onClick={toggleSortOrder}
                >
                    <span className="icon-arrow">{isAscending ? '▲' : '▼'}</span> Sort by Volume
                </button>
            </div>
            
            <div className={`crypto-container ${viewMode}`}>
                {viewMode === 'list' ? (
                    <Table striped bordered hover className="table-custom">
                        <thead>
                            <tr>
                                <th>Favorite</th>
                                <th>Symbol</th>
                                <th>Logo</th> 
                                <th>Price Change</th>
                                <th>Last Price</th>
                                <th>
                                    <span className="me-2">Volume</span>
                                </th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cryptoData.map((crypto) => (
                                <tr key={crypto.s}>
                                    <td onClick={() => toggleFavorite(crypto.s)}>
                                        <i className={`bi ${favorites.includes(crypto.s) ? 'bi-star-fill' : 'bi-star'}`}></i>
                                    </td>
                                    <td>{crypto.s}</td>
                                    <td>
                                        <img src={getLogo(crypto.s.replace("USDT", "").toUpperCase())} alt={`${crypto.s} logo`} width="32" height="32" />
                                    </td>
                                    <td>
                                        <span className={getPriceChangeClass(crypto.p)}>
                                            {crypto.p}
                                        </span>
                                    </td>
                                    <td>{crypto.c}</td>
                                    <td>{crypto.v}</td>
                                    <td>
                                        <Link to={`/cryptoDetails/${crypto.s}`} className="btn btn-primary">
                                            Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    <div className="crypto-grid">
                        {cryptoData.map((crypto) => (
                            <div key={crypto.s} className="crypto-item">
                                <div onClick={() => toggleFavorite(crypto.s)}>
                                    <i className={`bi ${favorites.includes(crypto.s) ? 'bi-star-fill' : 'bi-star'}`}></i>
                                </div>
                                <div><strong>{crypto.s}</strong></div>
                                <div>
                                    <img src={getLogo(crypto.s.replace("USDT", "").toUpperCase())} alt={`${crypto.s} logo`} width="32" height="32" />
                                </div> {/* Logo */}
                                <div>
                                    <span className={getPriceChangeClass(crypto.p)}>
                                        Price Change: {crypto.p}
                                    </span>
                                </div>
                                <div>Last Price: {crypto.c}</div>
                                <div>Volume: {crypto.v}</div>
                                <Link to={`/cryptoDetails/${crypto.s}`} className="btn btn-primary">
                                    Details
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
