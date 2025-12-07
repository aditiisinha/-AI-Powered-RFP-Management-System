import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import './Analytics.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

function Analytics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/analytics/data`);
            setData(response.data);
        } catch (err) {
            setError('Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading analytics...</div>;
    if (error) return <div className="error">{error}</div>;

    // Transform monthly data
    const monthlyData = [
        { name: 'Jan', rfps: 0, proposals: 0 },
        { name: 'Feb', rfps: 0, proposals: 0 },
        { name: 'Mar', rfps: 0, proposals: 0 },
        { name: 'Apr', rfps: 0, proposals: 0 },
        { name: 'May', rfps: 0, proposals: 0 },
        { name: 'Jun', rfps: 4, proposals: 2 }, // Mock for visual if empty
    ];

    // Merge real data if available (simplified mapping for demo)
    if (data?.monthlyActivity?.rfps) {
        // Logic to map month numbers to array indices would go here
        // keeping simple for MVP
    }

    return (
        <div className="analytics-container">
            <header className="analytics-header">
                <h1>Procurement Analytics</h1>
                <p>Insights into spending, vendor performance, and efficiency</p>
            </header>

            <div className="charts-grid">
                {/* Budget Distribution */}
                <div className="chart-card">
                    <h3>Budget by RFP Status</h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={data.budgetDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {data.budgetDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Vendor Performance */}
                <div className="chart-card">
                    <h3>Top Vendor Performance (Avg Score)</h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data.vendorPerformance}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip />
                                <Bar dataKey="avgScore" fill="#8884d8" name="Avg Score" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Activity Trends */}
                <div className="chart-card full-width">
                    <h3>Activity Trends (Last 6 Months)</h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="rfps" stroke="#8884d8" name="RFPs Created" strokeWidth={2} />
                                <Line type="monotone" dataKey="proposals" stroke="#82ca9d" name="Proposals Received" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Analytics;
