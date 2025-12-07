import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/dashboard/stats`);
                setStats(response.data);
            } catch (err) {
                setError('Failed to load dashboard statistics');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="loading">Loading dashboard...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Overview</h1>
                <p>Welcome back! Here's what's happening today.</p>
            </header>

            <div className="stats-grid">
                <div className="stat-card blue">
                    <div className="stat-icon">📄</div>
                    <div className="stat-info">
                        <h3>Total RFPs</h3>
                        <div className="stat-value">{stats?.metrics?.totalRFPs || 0}</div>
                    </div>
                </div>
                <div className="stat-card green">
                    <div className="stat-icon">✅</div>
                    <div className="stat-info">
                        <h3>Active RFPs</h3>
                        <div className="stat-value">{stats?.metrics?.activeRFPs || 0}</div>
                    </div>
                </div>
                <div className="stat-card purple">
                    <div className="stat-icon">🏢</div>
                    <div className="stat-info">
                        <h3>Vendors</h3>
                        <div className="stat-value">{stats?.metrics?.totalVendors || 0}</div>
                    </div>
                </div>
                <div className="stat-card orange">
                    <div className="stat-icon">📨</div>
                    <div className="stat-info">
                        <h3>Proposals</h3>
                        <div className="stat-value">{stats?.metrics?.totalProposals || 0}</div>
                    </div>
                </div>
            </div>

            <div className="recent-activity">
                <h2>Recent RFPs</h2>
                <div className="activity-list">
                    {stats?.recentActivity?.length > 0 ? (
                        stats.recentActivity.map((rfp) => (
                            <div key={rfp._id} className="activity-item">
                                <div className="activity-content">
                                    <h4>{rfp.title}</h4>
                                    <span className="activity-date">
                                        {new Date(rfp.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <span className={`status-badge status-${rfp.status}`}>
                                    {rfp.status}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="no-activity">No recent activity found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
