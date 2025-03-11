import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_FOOTBALL_KEY;
const API_HOST = import.meta.env.VITE_API_FOOTBALL_HOST;

// Create reusable API instance
const footballApi = axios.create({
    baseURL: 'https://v3.football.api-sports.io',
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
        console.log('API Response:', response.data); // Log the full response
        return response.data.response || [];
    } catch (error) {
        console.error('Error fetching players:', error); // Log any errors
        return [];
    }
};

// Fetch players by category (Popular, position type, etc.)
export const getPlayersByCategory = async (category, page = 1) => {
    let params = new URLSearchParams({
        season: '2024',
        page: page
    });

    // Apply category-specific filters
    switch (category) {
        case 'popular':
            params.append('league', '39,140,78,135,61'); // Premier League, La Liga, Bundesliga, etc.
            break;
        case 'attackers':
            params.append('position', 'Attacker');
            break;
        case 'midfielders':
            params.append('position', 'Midfielder');
            break;
        case 'defenders':
            params.append('position', 'Defender');
            break;
        case 'goalkeepers':
            params.append('position', 'Goalkeeper');
            break;
        case 'rising-stars':
            params.append('age', '16-21'); // Young talents
            break;
    }

    const response = await footballApi.get(`/players`, { params });
    return response.data.response || [];
};

// Sort players by a given metric
export const sortPlayersByMetric = (players, metric) => {
    return [...players].sort((a, b) => {
        // Extract the relevant metric from player statistics
        const getMetricValue = (player) => {
            if (!player.statistics || player.statistics.length === 0) return 0;

            const stats = player.statistics[0];
            switch (metric) {
                case 'goals':
                    return stats.goals?.total || 0;
                case 'assists':
                    return stats.goals?.assists || 0;
                case 'rating':
                    return parseFloat(stats.games?.rating) || 0;
                case 'appearances':
                    return stats.games?.appearences || 0;
                default:
                    return 0;
            }
        };

        return getMetricValue(b) - getMetricValue(a); // Descending order
    });
};
