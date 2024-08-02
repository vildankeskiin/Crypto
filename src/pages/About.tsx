import React from 'react';
import './About.css'; 

const About: React.FC = () => {
    return (
        <div className="about-container">
            <h1>About</h1>
            <p>
                <strong>Crypto Tracker</strong> is a web application that allows you to track the price data and market details of cryptocurrencies in real-time. Users can examine the price changes of various cryptocurrencies through charts and tables, mark their favorite cryptocurrencies, and analyze price movements over specific time periods.
            </p>
            <h2>Features:</h2>
            <ul>
                <li><strong>Cryptocurrency Details:</strong> Displays key market information of the selected cryptocurrency in a table, including the symbol, price change, price change percentage, average price, closing price, last price, highest and lowest prices, and more.</li>
                <li><strong>Real-Time Data:</strong> Fetches real-time price and market data using the Binance API.</li>
                <li><strong>Time Range Selection:</strong> Users can view price data over different time periods, including 24 hours, 7 days, and 30 days. These time periods can be selected using the respective buttons.</li>
                <li><strong>Chart Display:</strong> Visualizes the price movements of the cryptocurrency over the selected time period using a line chart. Charts help users easily analyze price trends.</li>
                <li><strong>Favorites Management:</strong> Users can add or remove their favorite cryptocurrencies. Favorite cryptocurrencies are stored locally on the user's device using <code>localStorage</code>.</li>
            </ul>
            <h2>Usage:</h2>
            <ol>
                <li><strong>Home Page:</strong> Users can see a list of various cryptocurrencies and a table of the top 10 highest-volume cryptocurrencies on the home page.</li>
                <li><strong>Cryptocurrency Details:</strong> By visiting the detail page of any cryptocurrency, users can review all relevant details and graphical analyses for that cryptocurrency.</li>
                <li><strong>Favorites Management:</strong> On the cryptocurrency detail page, users can manage their favorite cryptocurrencies by clicking the "Add to Favorites" or "Remove from Favorites" buttons.</li>
            </ol>
            <h2>Technologies:</h2>
            <ul>
                <li><strong>Frontend:</strong> React, TypeScript, React-Bootstrap, Chart.js (react-chartjs-2)</li>
                <li><strong>Backend:</strong> Binance API</li>
            </ul>
            <h2>Project Purpose:</h2>
            <p>
                Crypto Tracker is developed to help users interested in cryptocurrencies better understand market trends and price changes. With a user-friendly interface and real-time data updates, it helps users effectively monitor market movements.
            </p>
        </div>
    );
};

export default About;
