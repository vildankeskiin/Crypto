import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, FormControl, } from 'react-bootstrap';

const Search: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/cryptoDetails/${searchTerm.trim().toUpperCase()}`);
        }
    };

    return (
        <Form onSubmit={handleSubmit} className="d-flex ms-3 me-auto">
            <FormControl
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                size="sm"
            />
            
        </Form>
    );
};

export default Search;
