import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, FormControl, Button } from 'react-bootstrap';
import './Search.css'; // Ensure you import the CSS file

const Search: React.FC<{ onSearch: (query: string) => void }> = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const trimmedSearchTerm = searchTerm.trim().toUpperCase();
        if (trimmedSearchTerm) {
            onSearch(trimmedSearchTerm); 
            navigate(`/cryptoDetails/${trimmedSearchTerm}`); 
        }
    };

    return (
        <Form onSubmit={handleSubmit} className="search-form ms-3 me-auto">
            <FormControl
                type="search"
                placeholder="Ara"
                aria-label="Ara"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                size="sm"
            />
            
        </Form>
    );
};

export default Search;
