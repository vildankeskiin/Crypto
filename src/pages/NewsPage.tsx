import React, { useEffect, useState } from 'react';
import './NewsPage.css'; // Create your CSS file

const NewsPage: React.FC = () => {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch('https://cryptopanic.com/api/free/v1/posts/?auth_token=296009c8b6dc2c2b476a9567f8a4da769c2c1c83&public=true');

                console.log(response);  

                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }

                const data = await response.json();
                console.log(data); 

                setNews(data.results || []); 

            } catch (error) {
                setError('An error occurred while fetching the data: ' + error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews(); 
    }, []);


    if (loading) {
        return <div>Loading...</div>;
    }


    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="news-container">
            <h1>Cryptocurrency News</h1>
            {news.map((article) => (
                <div key={article.id} className="news-article">
                    <h2>{article.title}</h2>
                    <p>{new Date(article.published_at).toLocaleString()}</p>
                    <p>{article.content}</p>
                    <a href={article.url} target="_blank" rel="noopener noreferrer">Read More</a>
                </div>
            ))}
        </div>
    );
};

export default NewsPage;
