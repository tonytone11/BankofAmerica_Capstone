import axios from 'axios';

// Create reusable API instance that uses the backend proxy
const footballApi = axios.create({
    // Use the proxy endpoint we created in the backend
    baseURL: '/football-api',
    // No API keys needed in frontend requests - they're added by the backend
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