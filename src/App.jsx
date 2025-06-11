import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import EmotionInput from "./EmotionInput";
import MusicRecommendations from "./MusicRecommendation";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import GenreSelection from "./GenreSelection";
import { supabase } from "./supabaseClient";
import { FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaMusic } from 'react-icons/fa';

// App.jsx
function App() {
    const [selectedEmotion, setSelectedEmotion] = useState(null);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [session, setSession] = useState(null);
    const [authView, setAuthView] = useState('login'); // 'login' or 'register'
    const [showAuth, setShowAuth] = useState(false); // Whether to show auth screens
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const profileMenuRef = useRef(null);

    useEffect(() => {
        // Check for existing session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        // Setup auth listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
            }
        );

        // Add event listener to close profile menu when clicking outside
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            subscription.unsubscribe();
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleBackClick = () => {
        if (selectedGenre) {
            setSelectedGenre(null);
        } else if (selectedEmotion) {
            setSelectedEmotion(null);
        } else if (showAuth) {
            setShowAuth(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setShowProfileMenu(false);
    };

    const toggleAuthView = () => {
        setAuthView(authView === 'login' ? 'register' : 'login');
    };

    // Show authentication screens if requested
    if (showAuth) {
        return (
            <>
                <div className="nav-bar">
                    <div className="nav-title">
                        MOOD TU
                        <span className="music-symbol">
                            <FaMusic />
                        </span>
                        EZ
                    </div>
                    <div className="nav-profile" ref={profileMenuRef}>
                        <button 
                            className="profile-icon-button" 
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                        >
                            <FaUser />
                        </button>
                    </div>
                </div>
                <div className="page-container">
                    <button onClick={handleBackClick} className="back-button-top">
                        Back to App
                    </button>
                    
                    {authView === 'login' ? (
                        <Login toggleView={toggleAuthView} />
                    ) : (
                        <Register toggleView={toggleAuthView} />
                    )}
                </div>
            </>
        );
    }

    // Navigation bar with profile menu
    const renderNavBar = () => (
        <div className="nav-bar">
            <div className="nav-title">
                MOOD TU
                <span className="music-symbol">
                    <FaMusic />
                </span>
                EZ
            </div>
            <div className="nav-profile" ref={profileMenuRef}>
                <button 
                    className="profile-icon-button" 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                    <FaUser />
                </button>
                
                {showProfileMenu && (
                    <div className="profile-menu">
                        {session ? (
                            <>
                                <div className="profile-menu-email">{session.user.email}</div>
                                <button 
                                    className="profile-menu-item" 
                                    onClick={handleLogout}
                                >
                                    <FaSignOutAlt /> Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <button 
                                    className="profile-menu-item" 
                                    onClick={() => {
                                        setAuthView('login');
                                        setShowAuth(true);
                                        setShowProfileMenu(false);
                                    }}
                                >
                                    <FaSignInAlt /> Login
                                </button>
                                <button 
                                    className="profile-menu-item" 
                                    onClick={() => {
                                        setAuthView('register');
                                        setShowAuth(true);
                                        setShowProfileMenu(false);
                                    }}
                                >
                                    <FaUserPlus /> Register
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );

    // Add error boundary to prevent white screen
    class ErrorBoundary extends React.Component {
        constructor(props) {
            super(props);
            this.state = { hasError: false, error: null, errorInfo: null };
        }
        
        componentDidCatch(error, errorInfo) {
            // Update state with the error details
            this.setState({ hasError: true, error, errorInfo });
            
            // Log the error with additional context from props
            console.error("React Error Boundary caught an error:", error, errorInfo);
            console.log("Error occurred with context:", {
                selectedEmotion: this.props.selectedEmotion,
                selectedGenre: this.props.selectedGenre,
                sessionActive: this.props.session ? true : false
            });
        }
        
        render() {
            if (this.state.hasError) {
                return (
                    <div className="error-boundary">
                        <h2>Something went wrong in the app</h2>
                        <p>We encountered an error processing your request. Please try the following:</p>
                        <ul>
                            <li>Reload the page to restart the app</li>
                            <li>Clear your browser cache and cookies</li>
                            <li>Try selecting a different genre or emotion</li>
                        </ul>
                        <button onClick={() => window.location.reload()}>Reload App</button>
                        <details>
                            <summary>Technical Error Details</summary>
                            <div className="error-info">
                                <p><strong>Error:</strong> {this.state.error && this.state.error.toString()}</p>
                                {this.state.error && this.state.error.message && (
                                    <p><strong>Message:</strong> {this.state.error.message}</p>
                                )}
                                <p><strong>Component Stack:</strong></p>
                                <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
                                <p><strong>Context:</strong></p>
                                <pre>
                                    Emotion: {this.props.selectedEmotion || 'Not selected'}<br />
                                    Genre: {this.props.selectedGenre || 'Not selected'}<br />
                                    Session: {this.props.session ? 'Active' : 'Not active'}
                                </pre>
                            </div>
                        </details>
                    </div>
                );
            }
            
            return this.props.children;
        }
    }

    return (
        <>
            {renderNavBar()}
            
            <ErrorBoundary 
                selectedEmotion={selectedEmotion}
                selectedGenre={selectedGenre}
                session={session}
            >
                {!selectedEmotion ? (
                    <div className="page-container with-nav">
                        <EmotionInput onEmotionSubmit={setSelectedEmotion} />
                    </div>
                ) : !selectedGenre ? (
                    <div className="black-background with-nav">
                        <GenreSelection 
                            emotion={selectedEmotion} 
                            onGenreSubmit={(genre) => {
                                console.log("Genre selected:", genre);
                                try {
                                    if (!genre) {
                                        console.error("Selected genre is null or undefined");
                                        alert("Invalid genre selection. Please try again.");
                                        return;
                                    }

                                    // Validate that it's one of the expected genres
                                    const validGenres = ["hip-hop", "rock", "country", "edm", "pop"];
                                    if (!validGenres.includes(genre)) {
                                        console.warn("Unexpected genre value:", genre);
                                    }

                                    // Set the genre state
                                    setSelectedGenre(genre);
                                } catch (err) {
                                    console.error("Error setting genre:", err);
                                    alert("Error selecting genre. Please try again.");
                                }
                            }} 
                            onBackClick={handleBackClick}
                        />
                    </div>
                ) : (
                    <div className="black-background with-nav">
                        <MusicRecommendations
                            key={`${selectedEmotion}-${selectedGenre}-${Date.now()}`}
                            emotion={selectedEmotion}
                            genre={selectedGenre}
                            onBackClick={handleBackClick}
                            session={session}
                        />
                    </div>
                )}
            </ErrorBoundary>
        </>
    );
}

export default App;