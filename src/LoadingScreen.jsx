import React from "react";
import { FaMusic } from "react-icons/fa";
import "./App.css";

function LoadingScreen({ onBackClick }) {
    return (
        <div className="loading-screen-container">
            {/* New Material Icon back button */}
            <button onClick={onBackClick} className="back-button-icon">
                <span className="material-symbols-outlined">arrow_back</span>
            </button>

            {/* Floating notes */}
            {[...Array(8)].map((_, i) => (
                <FaMusic
                    key={i}
                    className="floating-note"
                    style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                    }}
                />
            ))}

            <div className="loading-screen-content">
                <h2 className="loading-screen-text">
                    Finding the soundtrack to<br />
                    <span className="highlight-word">your moment</span>
                    <span className="music-note-loading">
                        <FaMusic />
                    </span>
                    <span className="ellipsis-animation">...</span>
                </h2>
                <div className="loading-spinner"></div>
            </div>
        </div>
    );
}

export default LoadingScreen;