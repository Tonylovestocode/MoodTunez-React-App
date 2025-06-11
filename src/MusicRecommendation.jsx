import React, { useEffect, useState } from "react";
import "./App.css";
import LoadingScreen from "./LoadingScreen";
import PlaylistRecommendation from "./PlaylistRecommendation";
import { supabase } from "./supabaseClient";
import { fetchPlaylistTracks } from "./soundcloudClient";

function MusicRecommendations({ emotion, genre, onBackClick, session }) {
    console.log("MusicRecommendations rendered with:", { emotion, genre });
    
    const [tracks, setTracks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Add safeguards in case null values are passed
    useEffect(() => {
        if (!emotion || !genre) {
            console.warn("Missing required props:", { emotion, genre });
            setError("Missing required information. Please go back and try again.");
            setIsLoading(false);
            return;
        }
        
        // Set up user ID from session
        if (session?.user) {
            setUserId(session.user.id);
        }
    }, [session, emotion, genre]);

    // Add regenerate handler function
    const handleRegenerate = () => {
        console.log("Regenerating playlist...");
        setIsLoading(true);
        setRefreshTrigger(prev => prev + 1); // Force a refresh
    };

    // Fetch tracks from Deezer (or fallback)
    useEffect(() => {
        if (!emotion || !genre) {
            console.warn("Skipping track fetch due to missing props", { emotion, genre });
            return;
        }

        console.log(`Starting to fetch tracks for emotion: ${emotion}, genre: ${genre}, refresh: ${refreshTrigger}`);
        setIsLoading(true);
        setTracks([]);
        setError(null);

        const fetchTracks = async () => {
            try {
                console.log(`Fetching ${emotion} ${genre} tracks`);
                
                // Fetch tracks from Deezer or fallback
                const fetchedTracks = await fetchPlaylistTracks(emotion, genre);
                
                if (!fetchedTracks || fetchedTracks.length === 0) {
                    console.error("No tracks were returned");
                    throw new Error("No tracks found. Please try again or select a different genre.");
                }
                
                console.log(`Successfully fetched ${fetchedTracks.length} tracks`);
                console.log("Example track:", fetchedTracks[0]);
                
                // If user is logged in, check for liked tracks
                if (userId) {
                    const { data: likedTracks, error } = await supabase
                        .from('liked_tracks')
                        .select('track_id')
                        .eq('user_id', userId);
                        
                    if (!error && likedTracks) {
                        const likedTrackIds = likedTracks.map(t => t.track_id);
                        
                        // Mark tracks as liked if they're in the user's liked tracks
                        fetchedTracks.forEach(track => {
                            if (likedTrackIds.includes(track.id.toString())) {
                                track.liked = true;
                            }
                        });
                    }
                }
                
                setTracks(fetchedTracks);
            } catch (error) {
                console.error("Error fetching tracks:", error);
                
                setError({
                    message: "Error getting tracks",
                    details: error.message || "There was a problem fetching tracks. Please try again or select a different genre.",
                    isDismissible: true
                });
            } finally {
                setIsLoading(false);
            }
        };

        // Execute the fetch
        fetchTracks();
    }, [emotion, genre, userId, refreshTrigger]);

    return (
        <div className="music-recommendations-container">
            {isLoading ? (
                <LoadingScreen onBackClick={onBackClick} />
            ) : (
                <PlaylistRecommendation
                    emotion={emotion}
                    genre={genre}
                    tracks={tracks}
                    userId={userId}
                    onBackClick={onBackClick}
                    isLoggedIn={!!session?.user}
                    onRegenerate={handleRegenerate}
                />
            )}
            
            {error && (
                <div className="notice-message">
                    <span>{error.message || error}</span>
                    {error.details && (
                        <p>{error.details}</p>
                    )}
                    {error.isDismissible && (
                        <button onClick={() => setError(null)}>Dismiss</button>
                    )}
                </div>
            )}
        </div>
    );
}

export default MusicRecommendations;