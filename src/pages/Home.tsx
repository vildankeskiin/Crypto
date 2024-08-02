import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CryptoData } from '../models/Crypto';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Home.css';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isAscending, setIsAscending] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<string | null>(null);

    useEffect(() => {
        fetchCryptoData();
        const storedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        setCurrentUser(storedUser);
    }, []);

    const fetchCryptoData = () => {
        axios.get<CryptoData[]>('https://api.binance.com/api/v3/ticker/24hr')
            .then((response) => {
                const cryptoArray = response.data
                    .filter((crypto) => crypto.symbol.endsWith("USDT"))
                    .sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume))
                    .slice(0, 10);
                setCryptoData(cryptoArray);
            })
            .catch((error) => {
                console.error('Error fetching crypto data:', error);
            });

        const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setFavorites(storedFavorites);
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

    const sortData = () => {
        const sortedData = [...cryptoData].sort((a, b) => {
            if (isAscending) {
                return parseFloat(a.volume) - parseFloat(b.volume);
            } else {
                return parseFloat(b.volume) - parseFloat(a.volume);
            }
        });
        setCryptoData(sortedData);
        setIsAscending(!isAscending);
    };

    return (
        <div className='container'>
            <h1 className="header-title">Top 10 Cryptocurrencies by Volume</h1>
            <Table striped bordered hover className="table-custom">
                <thead>
                    <tr>
                        <th>Favorite</th>
                        <th>Symbol</th>
                        <th>Price Change</th>
                        <th>Last Price</th>
                        <th>
                            <span className="me-2">Volume</span>
                            <button type="button" className="btn btn-outline-secondary" onClick={sortData}>
                            <span className="icon-arrow">{isAscending ? '▲' : '▼'}</span>
                            </button>
                        </th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {cryptoData.map((crypto) => (
                        <tr key={crypto.symbol}>
                            <td onClick={() => currentUser ? toggleFavorite(crypto.symbol) : alert('Please log in to add favorites.')}>
                                <i className={`bi ${favorites.includes(crypto.symbol) ? 'bi-star-fill' : 'bi-star'}`}></i>
                            </td>
                            <td>{crypto.symbol}</td>
                            <td>{crypto.priceChange}</td>
                            <td>{crypto.lastPrice}</td>
                            <td>{crypto.volume}</td>
                            <td>
                                <Link to={`/cryptoDetails/${crypto.symbol}`} className="btn btn-primary">
                                    Details
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default Home;
