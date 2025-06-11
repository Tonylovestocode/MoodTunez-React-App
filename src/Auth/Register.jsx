import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { FaMusic } from 'react-icons/fa';
import '../App.css';

function Register({ toggleView }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }
        
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) throw error;
            
            // Store user preferences in Supabase table
            const { data: { user } } = await supabase.auth.getUser();
            
            if (user) {
                const { error: profileError } = await supabase
                    .from('user_profiles')
                    .insert([
                        { 
                            user_id: user.id,
                            email: user.email,
                            created_at: new Date()
                        }
                    ]);
                
                if (profileError) throw profileError;
            }
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
                <h2>Create Account</h2>
                
                {error && <div className="auth-error">{error}</div>}
                
                <form onSubmit={handleRegister} className="auth-form">
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
                    
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>
                
                <div className="auth-footer">
                    Already have an account?{' '}
                    <button onClick={toggleView} className="auth-link">
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Register; 