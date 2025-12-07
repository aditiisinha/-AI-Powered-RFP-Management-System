import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import RFPList from './components/RFPList';
import RFPCreator from './components/RFPCreator';
import VendorManagement from './components/VendorManagement';
import Analytics from './components/Analytics';
import ProposalComparison from './components/ProposalComparison';
import Login from './components/Login';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
            setUser({ name: 'Admin User', email: 'admin@rfp.com' });
        }
    }, []);

    const handleLogin = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
        localStorage.setItem('token', 'demo-token');
        navigate('/');
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (!isAuthenticated) {
        return <Login onLogin={handleLogin} />;
    }

    // Helper to determine active class
    const getActiveClass = (path) => {
        if (path === '/') {
            return location.pathname === '/' ? 'active' : '';
        }
        if (path === '/rfps') {
            return location.pathname.startsWith('/rfps') || location.pathname.startsWith('/rfp/') ? 'active' : '';
        }
        return location.pathname.startsWith(path) ? 'active' : '';
    };

    return (
        <div className="app">
            {/* Sidebar Navigation */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo">
                        <div className="logo-icon-wrapper">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 2L18.5 9H25L20 14.5L22.5 21.5L16 17L9.5 21.5L12 14.5L7 9H13.5L16 2Z" fill="url(#logo-gradient)" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M4 28H28" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                <defs>
                                    <linearGradient id="logo-gradient" x1="16" y1="2" x2="16" y2="21.5" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#4318FF" />
                                        <stop offset="1" stopColor="#A482FF" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <h2 className="logo-text">RFP AI</h2>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <button
                        className={`nav-item ${getActiveClass('/')}`}
                        onClick={() => navigate('/')}
                    >
                        <span className="nav-icon">📊</span>
                        <span className="nav-text">Dashboard</span>
                    </button>

                    <button
                        className={`nav-item ${getActiveClass('/rfps')}`}
                        onClick={() => navigate('/rfps')}
                    >
                        <span className="nav-icon">📄</span>
                        <span className="nav-text">RFPs</span>
                    </button>

                    <button
                        className={`nav-item ${getActiveClass('/create')}`}
                        onClick={() => navigate('/create')}
                    >
                        <span className="nav-icon">✨</span>
                        <span className="nav-text">Create RFP</span>
                    </button>

                    <button
                        className={`nav-item ${getActiveClass('/vendors')}`}
                        onClick={() => navigate('/vendors')}
                    >
                        <span className="nav-icon">🏢</span>
                        <span className="nav-text">Vendors</span>
                    </button>

                    <button
                        className={`nav-item ${getActiveClass('/analytics')}`}
                        onClick={() => navigate('/analytics')}
                    >
                        <span className="nav-icon">📈</span>
                        <span className="nav-text">Analytics</span>
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="user-avatar">{user?.name?.charAt(0) || 'A'}</div>
                        <div className="user-info">
                            <div className="user-name">{user?.name}</div>
                            <div className="user-email">{user?.email}</div>
                        </div>
                    </div>
                    <button className="btn-logout" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <div className="content-wrapper">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/rfps" element={<RFPList />} />
                        <Route path="/create" element={<RFPCreator />} />
                        <Route path="/vendors" element={<VendorManagement />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/rfp/:id" element={<ProposalComparison />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}

export default App;
