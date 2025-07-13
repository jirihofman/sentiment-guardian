'use client';

import React, { useEffect, useState } from 'react';
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
import { Line } from 'react-chartjs-2';
import PropTypes from 'prop-types';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const SentimentChart = ({ height = 400 }) => {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSentimentData = async () => {
            try {
                const response = await fetch('/api/sentiment-chart');
                if (!response.ok) {
                    throw new Error('Failed to fetch sentiment data');
                }
                const data = await response.json();
                setChartData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSentimentData();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading chart...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                Error loading sentiment chart: {error}
            </div>
        );
    }

    if (!chartData || chartData.length === 0) {
        return (
            <div className="alert alert-info" role="alert">
                No sentiment data available for chart display.
            </div>
        );
    }

    const data = {
        datasets: [
            {
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgb(75, 192, 192)',
                data: chartData.map(item => item.sentiment),
                label: 'Average Daily Sentiment',
                tension: 0.1,
            },
        ],
        labels: chartData.map(item => item.date),
    };

    const options = {
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Guardian Headlines Sentiment Over Time',
            },
        },
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date',
                },
            },
            y: {
                beginAtZero: false,
                max: 100,
                min: 0,
                title: {
                    display: true,
                    text: 'Sentiment Score (1-100)',
                },
            },
        },
    };

    return (
        <div className="card mb-4">
            <div className="card-header">
                <h5 className="card-title mb-0">Sentiment Trends</h5>
            </div>
            <div className="card-body">
                <Line data={data} options={options} height={height} />
            </div>
        </div>
    );
};

SentimentChart.propTypes = {
    height: PropTypes.number,
};

export default SentimentChart;