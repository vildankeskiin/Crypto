import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './CryptoChart.css';
import { Button } from 'react-bootstrap';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const intervals = {
  '24h': { interval: '1h', limit: 24 },
  '7d': { interval: '1d', limit: 7 },
  '30d': { interval: '1d', limit: 30 },
  '1y': { interval: '1M', limit: 12 },
};

interface CryptoChartProps {
  symbol: string;
}

const CryptoChart: React.FC<CryptoChartProps> = ({ symbol }) => {
  const [selectedRange, setSelectedRange] = useState<keyof typeof intervals>('24h');
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (!symbol) return;

    const { interval, limit } = intervals[selectedRange];
    axios.get(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`)
      .then((response) => {
        const data = response.data.map((kline: any) => ({
          time: new Date(kline[0]),
          close: parseFloat(kline[4]),
        }));

        const labels = data.map((d: any) => {
          const dateOptions: Intl.DateTimeFormatOptions = selectedRange === '24h' 
            ? { hour: '2-digit', minute: '2-digit' }
            : { month: 'short', day: 'numeric', year: 'numeric' };
          return d.time.toLocaleDateString(undefined, dateOptions);
        });

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Price',
              data: data.map((d: any) => d.close),
              borderColor: 'red',
              borderWidth: 0.5,
              fill: false,
            },
          ],
        });
      })
      .catch((error) => {
        console.error('Error fetching chart data:', error);
      });
  }, [symbol, selectedRange]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: 'white', 
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
          borderColor: 'white',
        },
      },
      y: {
        ticks: {
          color: 'white', 
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)', 
          borderColor: 'white',
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: 'white', 
        },
      },
    },
  };

  return (
    <div>
      <div className="button-container">
        <Button 
          className={selectedRange === '24h' ? 'active' : ''} 
          onClick={() => setSelectedRange('24h')}
        >
          24 Hours
        </Button>
        <Button 
          className={selectedRange === '7d' ? 'active' : ''} 
          onClick={() => setSelectedRange('7d')}
        >
          7 Days
        </Button>
        <Button 
          className={selectedRange === '30d' ? 'active' : ''} 
          onClick={() => setSelectedRange('30d')}
        >
          30 Days
        </Button>
        <Button 
          className={selectedRange === '1y' ? 'active' : ''} 
          onClick={() => setSelectedRange('1y')}
        >
          1 Year
        </Button>
      </div>
      <div className="chart-container">
        {chartData ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <p className="text-center">Loading chart data...</p>
        )}
      </div>
    </div>
  );
};

export default CryptoChart;

