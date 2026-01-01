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
            <div className="card">
                <div className="card-body d-flex justify-content-center align-items-center" style={{ height: `${height}px` }}>
                    <div className="text-center">
                        <div className="spinner-border text-primary mb-3" role="status">
                            <span className="visually-hidden">Loading chart...</span>
                        </div>
                        <p className="text-muted mb-0">Loading sentiment data...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger d-flex align-items-center" role="alert">
                <svg className="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Error:">
                    <use xlinkHref="#exclamation-triangle-fill"/>
                </svg>
                <div>
                    Error loading sentiment chart: {error}
                </div>
            </div>
        );
    }

    if (!chartData || chartData.length === 0) {
        return (
            <div className="alert alert-info d-flex align-items-center" role="alert">
                <svg className="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Info:">
                    <use xlinkHref="#info-fill"/>
                </svg>
                <div>
                    No sentiment data available for chart display.
                </div>
            </div>
        );
    }

    const data = {
        datasets: [
            {
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                borderColor: 'rgb(37, 99, 235)',
                borderWidth: 2,
                data: chartData.map(item => item.sentiment),
                fill: true,
                label: 'Average Daily Sentiment',
                pointBackgroundColor: 'rgb(37, 99, 235)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(37, 99, 235)',
                pointHoverBorderWidth: 2,
                pointHoverRadius: 6,
                pointRadius: 4,
                tension: 0.3,
            },
        ],
        labels: chartData.map(item => item.date),
    };

    const options = {
        plugins: {
            legend: {
                display: true,
                labels: {
                    boxHeight: 8,
                    boxWidth: 40,
                    font: {
                        size: 13,
                        weight: '500',
                    },
                    padding: 15,
                    usePointStyle: false,
                },
                position: 'top',
            },
            title: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                bodyColor: '#0f172a',
                bodyFont: {
                    size: 13,
                },
                borderColor: '#e2e8f0',
                borderWidth: 1,
                callbacks: {
                    label: function(context) {
                        return `Sentiment: ${context.parsed.y}/100`;
                    }
                },
                padding: 12,
                titleColor: '#64748b',
                titleFont: {
                    size: 13,
                    weight: '600',
                },
            },
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: {
                    color: '#f1f5f9',
                    display: true,
                },
                ticks: {
                    color: '#64748b',
                    font: {
                        size: 12,
                    },
                },
                title: {
                    color: '#64748b',
                    display: true,
                    font: {
                        size: 13,
                        weight: '600',
                    },
                    text: 'Date',
                },
            },
            y: {
                beginAtZero: false,
                grid: {
                    color: '#f1f5f9',
                    display: true,
                },
                max: 100,
                min: 0,
                ticks: {
                    color: '#64748b',
                    font: {
                        size: 12,
                    },
                },
                title: {
                    color: '#64748b',
                    display: true,
                    font: {
                        size: 13,
                        weight: '600',
                    },
                    text: 'Sentiment Score (1-100)',
                },
            },
        },
    };

    return (
        <div className="card">
            <div className="card-header">
                <h5 className="mb-0 fw-semibold">Sentiment Trends Over Time</h5>
            </div>
            <div className="card-body" style={{ height: `${height}px` }}>
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

SentimentChart.propTypes = {
    height: PropTypes.number,
};

export default SentimentChart;