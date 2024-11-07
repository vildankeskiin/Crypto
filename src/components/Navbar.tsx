import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import Switch from 'react-switch'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css'; 

const CustomNavbar: React.FC = () => {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    // Tema state'ini başlatırken localStorage kontrol et
    const [isDarkTheme, setIsDarkTheme] = useState(() => localStorage.getItem('theme') === 'dark');

    // Temayı ve body class'ını güncelleyen yardımcı fonksiyon
    const updateTheme = (darkMode: boolean) => {
        const theme = darkMode ? 'dark' : 'light';
        document.body.classList.toggle('dark-theme', darkMode);
        document.body.classList.toggle('light-theme', !darkMode);
        localStorage.setItem('theme', theme);
    };

    useEffect(() => {
        // Temayı güncelle
        updateTheme(isDarkTheme);

        // Tema değişikliklerini diğer bileşenlere bildirmek için event dispatch et
        const themeChangeEvent = new CustomEvent('themeChange', { detail: { theme: isDarkTheme ? 'dark' : 'light' } });
        window.dispatchEvent(themeChangeEvent);
    }, [isDarkTheme]);

    // Tema toggle fonksiyonu
    const toggleTheme = () => setIsDarkTheme(prev => !prev);

    // Kullanıcı çıkış yapma fonksiyonu
    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('favorites');
        navigate('/login');
    };

    // Favoriler sayfasına yönlendirme
    const handleFavoritesClick = () => {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        if (favorites.length === 0) {
            alert('No favorites added.');
        } else {
            navigate('/favorites');
        }
    };

    return (
        <Navbar bg="light" expand="lg" fixed="top" className="navbar-custom">
            <div className="container-fluid">
                <Navbar.Brand as={Link} to="/home">CryptoTracker</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                        <Nav.Link as={Link} to="/cryptoDetails/BTCUSDT">Crypto Details</Nav.Link>
                        <Nav.Link as={Link} to="/compare">Compare</Nav.Link>
                        <Nav.Link as={Link} to="/news">News</Nav.Link>
                        <Nav.Link as="button" onClick={handleFavoritesClick}>Favorites</Nav.Link>
                    </Nav>

                    <Nav className="ms-auto align-items-center">
                        {currentUser ? (
                            <NavDropdown title={`Hello, ${currentUser.name}`} id="user-dropdown">
                                <NavDropdown.Item as="button" onClick={handleLogout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                        )}
                        
                        {/* Tema değiştirici Switch */}
                        <div className="d-flex align-items-center ms-3">
                            <Switch
                                onChange={toggleTheme}
                                checked={isDarkTheme}
                                onColor="#000"
                                offColor="#fff"
                                onHandleColor="#fff"
                                offHandleColor="#000"
                                checkedIcon={false}
                                uncheckedIcon={false}
                                height={20}
                                width={40}
                            />
                            <span style={{ marginLeft: '10px' }}>
                                {isDarkTheme ? '🌙' : '☀️'}
                            </span>
                        </div>
                    </Nav>
                </Navbar.Collapse>
            </div>
        </Navbar>
    );
};

export default CustomNavbar;
