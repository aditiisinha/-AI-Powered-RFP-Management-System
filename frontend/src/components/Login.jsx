import React, { useState } from 'react';

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin({ name: 'Demo User', email });
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0f0f23' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '1rem', backdropFilter: 'blur(10px)' }}>
                <h1 style={{ color: 'white' }}>Login</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ display: 'block', margin: '1rem 0', padding: '0.5rem', width: '100%' }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ display: 'block', margin: '1rem 0', padding: '0.5rem', width: '100%' }}
                    />
                    <button type="submit" style={{ padding: '0.5rem 2rem', background: '#667eea', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
