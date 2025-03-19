import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_FOOTBALL_KEY;
const API_HOST = import.meta.env.VITE_API_FOOTBALL_HOST;

// Create reusable API instance - Updated to use proxy
const footballApi = axios.create({
    // Use the proxy path instead of the direct API URL
    baseURL: '/football-api',
    headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': API_HOST
    }
});

// Search players by name
export const searchPlayers = async (query) => {
    try {
        const response = await footballApi.get('/players/profiles', {
            params: {
                search: query
            }
        });
        console.log('API Response:', response.data);
        return response.data.response || [];
    } catch (error) {
        console.error('Error fetching players:', error);
        return [];
    }
};

// Get player statistics by ID 
// Featured player
export const getPlayerStatistics = async (playerId, season = 2023) => {
    try {
        const response = await footballApi.get('/players', {
            params: {
                id: playerId,
                season: season,
            }
        });
        console.log('Player Statistics Response:', response.data);
        return response.data.response || null;
    } catch (error) {
        console.error('Error fetching player statistics:', error);
        return null;
    }
};

// Popular player
export const getPlayerById = async (playerId) => {
    try {
        console.log(`Fetching player with ID: ${playerId}`);
        const response = await footballApi.get('/players/profiles', {
            params: {
                player: playerId
            }
        });

        console.log(`Response for player ${playerId}:`, response.data);

        // Check if response contains data and has the expected structure
        if (response.data && response.data.response && response.data.response.length > 0) {
            // Return the player object from the first result
            return response.data.response[0].player;
        }
        console.warn(`No player data found for ID: ${playerId}`);
        return null;
    } catch (error) {
        console.error(`Error fetching player ${playerId}:`, error);
        // Add more detailed error logging
        if (error.response) {
            console.error('Error response:', error.response.data);
            console.error('Status:', error.response.status);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error message:', error.message);
        }
        return null;
    }
};

export default footballApi;