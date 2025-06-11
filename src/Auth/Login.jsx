import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { FaMusic } from 'react-icons/fa';
import '../App.css';

function Login({ toggleView }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="page-title">
                MOOD TU<span className="music-letter"><FaMusic /></span>EZ
            </div>
            
            <div className="auth-card">
                <h2>Login</h2>
                
                {error && <div className="auth-error">{error}</div>}
                
                <form onSubmit={handleLogin} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Sign In'}
                    </button>
                </form>
                
                <div className="auth-footer">
                    Don't have an account?{' '}
                    <button onClick={toggleView} className="auth-link">
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login; 