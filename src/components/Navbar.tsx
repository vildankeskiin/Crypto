import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav , NavDropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css'; 

const CustomNavbar: React.FC = () => {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

    const handleLogout = () => {
        
        localStorage.removeItem('currentUser');
        
        
        localStorage.removeItem('favorites');

        
        navigate('/login');
    };

    const handleFavoritesClick = () => {
        if (favorites.length === 0) {
            alert('No favorites added.');
        } else {
            navigate('/favorites');
        }
    };

    return (
        <Navbar bg="light" expand="lg" fixed="top" className="navbar-custom">
            <div className="container-fluid">
                <Navbar.Brand as={Link} to="/">Home</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/cryptoDetails/BTCUSDT">CryptoDetails</Nav.Link>
                        <Nav.Link as="button" onClick={handleFavoritesClick}>Favorites</Nav.Link>
                    </Nav>
                    <Nav className="ms-auto">
                        {currentUser ? (
                            <NavDropdown title={`Hello, ${currentUser.name}`} id="user-dropdown">
                                <NavDropdown.Item as="button" onClick={handleLogout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </div>
        </Navbar>
    );
};

export default CustomNavbar;
