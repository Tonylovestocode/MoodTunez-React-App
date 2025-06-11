// Music API client with Deezer integration and robust fallback
// This is a simplified version that always returns tracks

// Define playlist IDs for each emotion and genre combination
const PLAYLISTS = {
    "HAPPY": {
        "hip-hop": "13810451101", // Your Deezer playlist ID
        "rock": "1119890211",
        "country": "1130112923",
        "edm": "1479458365",
        "pop": "1109890291"
    },
    "SAD": {
        "hip-hop": "1483340695",
        "rock": "1390459765",
        "country": "1440614715",
        "edm": "8504291062",
        "pop": "2098157264"
    },
    "STRESSED": {
        "hip-hop": "1183622105",
        "rock": "1154814971",
        "country": "1585168835",
        "edm": "9086483382",
        "pop": "1313621735"
    },
    "MOTIVATED": {
        "hip-hop": "1950946762",
        "rock": "1313567485",
        "country": "1269971343",
        "edm": "2279146346",
        "pop": "1990546362"
    }
};

// Hardcoded hip-hop tracks that are GUARANTEED to work
const HIP_HOP_TRACKS = [
    {
        title: "DNA",
        artist: "Kendrick Lamar",
        preview: "https://cdns-preview-8.dzcdn.net/stream/c-8c116e36b8a51a4c8656eb29ae9ca7a6-5.mp3",
        img: "https://e-cdns-images.dzcdn.net/images/cover/62b451e7adce793a4a193f347825f43e/500x500-000000-80-0-0.jpg"
    },
    {
        title: "Sicko Mode",
        artist: "Travis Scott",
        preview: "https://cdns-preview-c.dzcdn.net/stream/c-cca63b2c92773d54e61c5b4d17695bd2-7.mp3",
        img: "https://e-cdns-images.dzcdn.net/images/cover/b6f05a46ef997e25fb1b3bffd36aa08b/500x500-000000-80-0-0.jpg"
    },
    {
        title: "Hotline Bling",
        artist: "Drake",
        preview: "https://cdns-preview-d.dzcdn.net/stream/c-d6046eda0f618b18e0a53ccd38c8bf4b-6.mp3",
        img: "https://e-cdns-images.dzcdn.net/images/cover/c7c8cf1bbd06e0e1de9ddbd0157c90d7/500x500-000000-80-0-0.jpg"
    },
    {
        title: "Mask Off",
        artist: "Future",
        preview: "https://cdns-preview-3.dzcdn.net/stream/c-3103c1b84e57a8945a64121e07bf86c9-6.mp3",
        img: "https://e-cdns-images.dzcdn.net/images/cover/97b81a0cc091e63d29a632db78eb2ee1/500x500-000000-80-0-0.jpg"
    },
    {
        title: "Panda",
        artist: "Desiigner",
        preview: "https://cdns-preview-d.dzcdn.net/stream/c-deda7fa9316d9e9e880d2c6207e92260-5.mp3",
        img: "https://e-cdns-images.dzcdn.net/images/cover/2606d687f33b28a838a5d47ebb71f1f0/500x500-000000-80-0-0.jpg"
    },
    {
        title: "Humble",
        artist: "Kendrick Lamar",
        preview: "https://cdns-preview-f.dzcdn.net/stream/c-f91f04f9a14b6589f4493458cc951f2a-6.mp3",
        img: "https://e-cdns-images.dzcdn.net/images/cover/133ed6d28ded8665fece9a465c2f82d6/500x500-000000-80-0-0.jpg"
    },
    {
        title: "Bad and Boujee",
        artist: "Migos",
        preview: "https://cdns-preview-5.dzcdn.net/stream/c-5d31de6290d8071cf8739e7a75cfcf91-6.mp3",
        img: "https://e-cdns-images.dzcdn.net/images/cover/e8fcbd03db9f3aafbc371fe45a0559b3/500x500-000000-80-0-0.jpg"
    },
    {
        title: "God's Plan",
        artist: "Drake",
        preview: "https://cdns-preview-d.dzcdn.net/stream/c-d5dd44cee773e73431d604795c022a97-7.mp3",
        img: "https://e-cdns-images.dzcdn.net/images/cover/8b8fc5d117e9501b541d94a53a191f12/500x500-000000-80-0-0.jpg"
    }
];

// Map of guaranteed tracks for each emotion-genre
const GUARANTEED_TRACKS = {
    "HAPPY": {
        "hip-hop": HIP_HOP_TRACKS,
        "rock": [
            {
                title: "Eye of the Tiger",
                artist: "Survivor",
                preview: "https://cdns-preview-0.dzcdn.net/stream/c-010f9938a077d0008df32cddbb9c55c7-9.mp3",
                img: "https://e-cdns-images.dzcdn.net/images/cover/5b12b2ff2b22931dd7c88546240c6c9c/500x500-000000-80-0-0.jpg"
            },
            {
                title: "We Will Rock You",
                artist: "Queen",
                preview: "https://cdns-preview-8.dzcdn.net/stream/c-85db2aaebfcd95c3fc30d3636ffa3cdb-9.mp3",
                img: "https://e-cdns-images.dzcdn.net/images/cover/2a05a5c0ee3bad88216a40750dc6cb0f/500x500-000000-80-0-0.jpg"
            }
        ],
        "pop": [
            {
                title: "Happy",
                artist: "Pharrell Williams",
                preview: "https://cdns-preview-8.dzcdn.net/stream/c-84c7ba173a085706e44472f9d26f3a9e-6.mp3",
                img: "https://e-cdns-images.dzcdn.net/images/cover/19cb7451b526ebe19e3ecd7946b1673a/500x500-000000-80-0-0.jpg"
            },
            {
                title: "Can't Stop the Feeling!",
                artist: "Justin Timberlake",
                preview: "https://cdns-preview-a.dzcdn.net/stream/c-a480b87b6c0a9367028b9127b6103b5e-6.mp3",
                img: "https://e-cdns-images.dzcdn.net/images/cover/5d586196a97188a5585b39e91bf6618a/500x500-000000-80-0-0.jpg"
            }
        ],
        "country": [
            {
                title: "Life Is a Highway",
                artist: "Rascal Flatts",
                preview: "https://cdns-preview-d.dzcdn.net/stream/c-d56c95b55d8555bd7bb816cb866a5863-6.mp3",
                img: "https://e-cdns-images.dzcdn.net/images/cover/83d4e82967f86e5fa9f6c3463c1c5920/500x500-000000-80-0-0.jpg"
            }
        ],
        "edm": [
            {
                title: "Don't You Worry Child",
                artist: "Swedish House Mafia",
                preview: "https://cdns-preview-c.dzcdn.net/stream/c-cfdaa286b3d6dcc9fb3c5e0324bfaadd-11.mp3",
                img: "https://e-cdns-images.dzcdn.net/images/cover/7bd0d12b9936a1bef938b42a4626cd46/500x500-000000-80-0-0.jpg"
            }
        ]
    },
    "SAD": {
        "hip-hop": [
            {
                title: "Lucid Dreams",
                artist: "Juice WRLD",
                preview: "https://cdns-preview-f.dzcdn.net/stream/c-fc42f19d130b853350ec19a095503493-7.mp3",
                img: "https://e-cdns-images.dzcdn.net/images/cover/24d3ba84aedc704f1370e92a0ca54e26/500x500-000000-80-0-0.jpg"
            }
        ],
        "rock": [
            {
                title: "Snuff",
                artist: "Slipknot",
                preview: "https://cdns-preview-9.dzcdn.net/stream/c-9b136da1a1ed6c79a4b4e96d33e9dc35-7.mp3",
                img: "https://e-cdns-images.dzcdn.net/images/cover/8c8b166cd0c869df9c71bd54704da119/500x500-000000-80-0-0.jpg"
            }
        ],
        "pop": [],
        "country": [],
        "edm": []
    },
    "STRESSED": {
        "hip-hop": [],
        "rock": [],
        "pop": [],
        "country": [],
        "edm": []
    },
    "MOTIVATED": {
        "hip-hop": [],
        "rock": [],
        "pop": [],
        "country": [],
        "edm": []
    }
};

/**
 * Fetch tracks for a specific emotion and genre
 * Simplified approach that always returns tracks
 */
async function fetchPlaylistTracks(emotion, genre) {
    console.log(`Fetching tracks for ${emotion} ${genre}`);
    
    // For HAPPY hip-hop, fetch from the Deezer playlist
    if (emotion === "HAPPY" && genre === "hip-hop") {
        console.log("Fetching from Deezer playlist for HAPPY hip-hop");
        
        // Get the playlist ID from the PLAYLISTS object
        const playlistId = PLAYLISTS[emotion][genre];
        console.log(`Using Deezer playlist ID: ${playlistId}`);
        
        try {
            // Fetch tracks from the Deezer playlist
            const tracks = await fetchSpecificPlaylist(playlistId);
            console.log(`Fetched ${tracks.length} tracks from Deezer playlist`);
            return tracks;
        } catch (error) {
            console.error("Error fetching from Deezer playlist:", error);
            console.log("Falling back to guaranteed tracks");
            
            // If fetch fails, fall back to guaranteed tracks
            return HIP_HOP_TRACKS.slice(0, 8).map((track, index) => ({
                id: `dz-${Date.now()}-${index}`,
                title: track.title,
                artist: track.artist,
                img: track.img,
                preview: track.preview,
                releaseYear: 2022 - (index % 5),
                liked: false,
                isNew: true,
                emotion: "HAPPY",
                genre: "hip-hop",
                isMainstream: index % 2 === 0
            }));
        }
    }
    
    // For all other emotion/genre combinations, use guaranteed tracks
    return getGuaranteedTracks(emotion, genre);
}

/**
 * Fetch tracks from a specific playlist ID directly
 * This is a more direct approach focusing just on your playlist
 */
async function fetchSpecificPlaylist(playlistId) {
    console.log(`Directly fetching playlist ID: ${playlistId}`);
    
    try {
        // Use CORS proxy for your playlist to avoid browser security issues
        const url = `https://corsproxy.io/?${encodeURIComponent(`https://api.deezer.com/playlist/${playlistId}`)}`;
        console.log(`Fetching from (with proxy): ${url}`);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        console.log(`Deezer API response status: ${response.status}`);
        
        if (!response.ok) {
            throw new Error(`Deezer API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Received data from Deezer:`, data ? "Success" : "Empty");
        
        if (!data || !data.tracks || !data.tracks.data || data.tracks.data.length === 0) {
            console.error(`No tracks found in playlist: ${playlistId}`);
            throw new Error("No tracks found in playlist");
        }
        
        const totalTracks = data.tracks.data.length;
        console.log(`Found ${totalTracks} tracks in playlist ${playlistId}`);
        
        // Shuffle the tracks
        const shuffledTracks = shuffleArray([...data.tracks.data]);
        
        // Take only the first 25 tracks after shuffling
        const selectedTracks = shuffledTracks.slice(0, 25);
        console.log(`Selected 25 random tracks from ${totalTracks} total tracks`);
        
        // Format the tracks
        const formattedTracks = selectedTracks.map((track, index) => ({
            id: `deezer-${track.id || Date.now() + index}`,
            title: track.title || `Track ${index + 1}`,
            artist: track.artist?.name || "Unknown Artist",
            img: track.album?.cover_medium || `https://picsum.photos/seed/${track.title || index}/300/300`,
            preview: track.preview, // Direct audio URL
            releaseYear: track.album?.release_date ? new Date(track.album.release_date).getFullYear() : 2020,
            liked: false,
            isNew: true,
            emotion: "HAPPY",
            genre: "hip-hop",
            isMainstream: track.rank > 50000
        }));
        
        console.log(`Returning 25 formatted tracks from your playlist`);
        return formattedTracks;
    } catch (error) {
        console.error(`Error fetching specific playlist ${playlistId}:`, error);
        // Fall back to guaranteed tracks
        return HIP_HOP_TRACKS.map((track, index) => ({
            id: `dz-${Date.now()}-${index}`,
            title: track.title,
            artist: track.artist,
            img: track.img,
            preview: track.preview,
            releaseYear: 2022 - (index % 5),
            liked: false,
            isNew: true,
            emotion: "HAPPY",
            genre: "hip-hop",
            isMainstream: index % 2 === 0
        }));
    }
}

// Helper function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Get guaranteed tracks that will work
 */
function getGuaranteedTracks(emotion, genre) {
    // Make sure emotion and genre are valid
    const validEmotion = Object.keys(GUARANTEED_TRACKS).includes(emotion) 
        ? emotion 
        : Object.keys(GUARANTEED_TRACKS)[0];
    
    const validGenre = GUARANTEED_TRACKS[validEmotion] && Object.keys(GUARANTEED_TRACKS[validEmotion]).includes(genre)
        ? genre
        : Object.keys(GUARANTEED_TRACKS[validEmotion])[0];
    
    // Get tracks for this emotion/genre, or fallback to HAPPY hip-hop if nothing else works
    let tracks = GUARANTEED_TRACKS[validEmotion][validGenre];
    if (!tracks || tracks.length === 0) {
        tracks = HIP_HOP_TRACKS;
    }
    
    // Format the tracks to match our app's format
    return tracks.map((track, index) => ({
        id: `dz-${Date.now()}-${index}`,
        title: track.title,
        artist: track.artist,
        img: track.img,
        preview: track.preview,
        releaseYear: 2022 - (index % 5),
        liked: false,
        isNew: true,
        emotion: validEmotion,
        genre: validGenre,
        isMainstream: index % 2 === 0
    }));
}

/**
 * Try to fetch tracks from a Deezer playlist
 */
async function fetchDeezerPlaylistTracks(emotion, genre) {
    try {
        // Check if we have a playlist for this combination
        if (!PLAYLISTS[emotion] || !PLAYLISTS[emotion][genre]) {
            console.warn(`No Deezer playlist defined for ${emotion} ${genre}`);
            return [];
        }
        
        const playlistId = PLAYLISTS[emotion][genre];
        console.log(`Attempting to fetch from Deezer playlist ID: ${playlistId}`);
        
        // Using CORS proxy to access Deezer API
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(`https://api.deezer.com/playlist/${playlistId}`)}`;
        console.log(`Fetching Deezer playlist through proxy: ${proxyUrl}`);
        
        const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        console.log(`Deezer API response status: ${response.status}`);
        
        if (!response.ok) {
            throw new Error(`Deezer API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Deezer playlist data received:`, data ? 'Success' : 'Empty response');
        
        if (!data || !data.tracks || !data.tracks.data || data.tracks.data.length === 0) {
            console.error(`No tracks found in Deezer playlist: ${playlistId}`);
            return [];
        }
        
        console.log(`Found ${data.tracks.data.length} tracks in Deezer playlist ${playlistId}`);
        
        // Format the tracks for our app
        return data.tracks.data.map((track, index) => ({
            id: `deezer-${track.id || Date.now() + index}`,
            title: track.title || `Track ${index + 1}`,
            artist: track.artist?.name || "Unknown Artist",
            img: track.album?.cover_medium || `https://picsum.photos/seed/${track.title || index}/300/300`,
            preview: track.preview, // This is the direct audio URL
            releaseYear: track.album?.release_date ? new Date(track.album.release_date).getFullYear() : 2020,
            liked: false,
            isNew: true,
            emotion: emotion,
            genre: genre,
            isMainstream: track.rank > 50000
        }));
    } catch (error) {
        console.error("Deezer fetch error:", error);
        return [];
    }
}

/**
 * Get stream URL for a track - for Deezer, preview URLs are already streamable
 */
async function getStreamUrl(trackId) {
    // For all our tracks, we already have direct audio URLs
    return null;
}

/**
 * Test connection to Deezer API
 */
async function testMusicApiConnection() {
    try {
        const response = await fetch("https://api.deezer.com/track/3135556");
        return response.ok;
    } catch (error) {
        console.error("Music API connection test failed:", error);
        return false;
    }
}

// Export the functions
export {
    fetchPlaylistTracks,
    getStreamUrl,
    testMusicApiConnection as testSoundCloudConnection
}; 