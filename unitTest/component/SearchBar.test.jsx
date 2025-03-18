import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SearchBar from '../../src/components/SearchBar'; // Adjust path as needed
import { searchPlayers } from '../../src/services/FootballAPI'; // Import the API service

// Create a manual mock for searchPlayers
const mockSearchPlayers = vi.fn();

// Mock the API service
vi.mock('../services/FootballAPI', () => ({
    searchPlayers: mockSearchPlayers
}));

describe('SearchBar Component', () => {
    // Sample mock data
    const mockPlayers = [
        {
            player: {
                id: 1,
                name: 'Lionel Messi',
                photo: 'messi.jpg',
            },
        },
        {
            player: {
                id: 2,
                name: 'Cristiano Ronaldo',
                photo: 'ronaldo.jpg',
            },
        },
        {
            player: {
                id: 3,
                name: 'Robert Lewandowski',
                photo: 'lewandowski.jpg',
            },
        },
        {
            player: {
                id: 4,
                name: 'Kevin De Bruyne',
                photo: 'debruyne.jpg',
            },
        },
        {
            player: {
                id: 5,
                name: 'Kylian Mbappé',
                photo: 'mbappe.jpg',
            },
        },
        {
            player: {
                id: 6,
                name: 'Erling Haaland',
                photo: 'haaland.jpg',
            },
        },
    ];

    // Setup before each test
    beforeEach(() => {
        // Clear all mocks
        vi.clearAllMocks();
        // Reset the mock implementation
        mockSearchPlayers.mockReset();
    });

    // Test 1: Component renders correctly
    it('renders the search input correctly', () => {
        render(<SearchBar />);

        // Check if the input field exists
        const searchInput = screen.getByPlaceholderText('Search for players by name...');
        expect(searchInput).toBeInTheDocument();
    });

    // Test 2: Input value changes when typed into
    it('updates query state when input value changes', async () => {
        render(<SearchBar />);

        // Get the input element
        const searchInput = screen.getByPlaceholderText('Search for players by name...');

        // Simulate typing in the input
        await userEvent.type(searchInput, 'Messi');

        // Check if the input value was updated
        expect(searchInput.value).toBe('Messi');
    });

    // Test 3: Form submission triggers API call
    it('calls searchPlayers API when form is submitted', async () => {
        // Setup mock to return empty array
        mockSearchPlayers.mockResolvedValue([]);

        render(<SearchBar />);

        // Get the input element and form
        const searchInput = screen.getByPlaceholderText('Search for players by name...');
        const form = searchInput.closest('form');

        // Type in the search query
        await userEvent.type(searchInput, 'Messi');

        // Submit the form
        fireEvent.submit(form);

        // Check if the API was called with the correct argument
        expect(mockSearchPlayers).toHaveBeenCalledWith('Messi');
    });

    // Test 4: Loading state is displayed
    it('displays loading state when API call is in progress', async () => {
        // Setup mock to return a promise that doesn't resolve immediately
        mockSearchPlayers.mockImplementation(() => new Promise(resolve => {
            setTimeout(() => resolve([]), 100);
        }));

        render(<SearchBar />);

        // Submit the form
        const searchInput = screen.getByPlaceholderText('Search for players by name...');
        const form = searchInput.closest('form');

        await userEvent.type(searchInput, 'Messi');
        fireEvent.submit(form);

        // Check if loading text is displayed
        expect(screen.getByText('Loading results...')).toBeInTheDocument();
    });

    // Test 5: Results are displayed after successful API call
    it('displays results after API returns data', async () => {
        // Setup mock to return data
        mockSearchPlayers.mockResolvedValue(mockPlayers.slice(0, 2));

        render(<SearchBar />);

        // Submit the form
        const searchInput = screen.getByPlaceholderText('Search for players by name...');
        const form = searchInput.closest('form');

        await userEvent.type(searchInput, 'Messi');
        fireEvent.submit(form);

        // Wait for results to appear
        await waitFor(() => {
            expect(screen.getByText('Lionel Messi')).toBeInTheDocument();
            expect(screen.getByText('Cristiano Ronaldo')).toBeInTheDocument();
        });
    });

    // Test 6: onSelectPlayer is called when a player is clicked
    it('calls onSelectPlayer when player is clicked', async () => {
        // Setup mock to return data
        mockSearchPlayers.mockResolvedValue([mockPlayers[0]]);

        // Create a mock function for onSelectPlayer
        const mockOnSelectPlayer = vi.fn();

        render(<SearchBar onSelectPlayer={mockOnSelectPlayer} />);

        // Submit the form
        const searchInput = screen.getByPlaceholderText('Search for players by name...');
        const form = searchInput.closest('form');

        await userEvent.type(searchInput, 'Messi');
        fireEvent.submit(form);

        // Wait for results to appear
        await waitFor(() => {
            expect(screen.getByText('Lionel Messi')).toBeInTheDocument();
        });

        // Click on the player
        fireEvent.click(screen.getByText('Lionel Messi'));

        // Check if onSelectPlayer was called with the correct player
        expect(mockOnSelectPlayer).toHaveBeenCalledWith(mockPlayers[0]);
    });

    // Test 7: Results and query are cleared after player selection
    it('clears results and query after player selection', async () => {
        // Setup mock to return data
        mockSearchPlayers.mockResolvedValue([mockPlayers[0]]);

        render(<SearchBar onSelectPlayer={() => { }} />);

        // Submit the form
        const searchInput = screen.getByPlaceholderText('Search for players by name...');
        const form = searchInput.closest('form');

        await userEvent.type(searchInput, 'Messi');
        fireEvent.submit(form);

        // Wait for results to appear
        await waitFor(() => {
            expect(screen.getByText('Lionel Messi')).toBeInTheDocument();
        });

        // Click on the player
        fireEvent.click(screen.getByText('Lionel Messi'));

        // Check if input is cleared
        expect(searchInput.value).toBe('');

        // Check if results are cleared (should not find the player name anymore)
        expect(screen.queryByText('Lionel Messi')).not.toBeInTheDocument();
    });

    // Test 8: Pagination displays correctly
    it('displays pagination when more than 5 results are returned', async () => {
        // Setup mock to return all mock players (more than itemsPerPage)
        mockSearchPlayers.mockResolvedValue(mockPlayers);

        render(<SearchBar />);

        // Submit the form
        const searchInput = screen.getByPlaceholderText('Search for players by name...');
        const form = searchInput.closest('form');

        await userEvent.type(searchInput, 'player');
        fireEvent.submit(form);

        // Wait for results to appear
        await waitFor(() => {
            // First page should show only the first 5 players
            expect(screen.getByText('Lionel Messi')).toBeInTheDocument();
            expect(screen.getByText('Kylian Mbappé')).toBeInTheDocument();

            // Sixth player should not be visible on first page
            expect(screen.queryByText('Erling Haaland')).not.toBeInTheDocument();

            // Pagination buttons should be visible
            const paginationButtons = screen.getAllByRole('button');
            expect(paginationButtons.length).toBe(3); // 3 page buttons
        });
    });

    // Test 9: Changing pages shows different results
    it('changes displayed results when pagination buttons are clicked', async () => {
        // Setup mock to return all mock players
        mockSearchPlayers.mockResolvedValue(mockPlayers);

        render(<SearchBar />);

        // Submit the form
        const searchInput = screen.getByPlaceholderText('Search for players by name...');
        const form = searchInput.closest('form');

        await userEvent.type(searchInput, 'player');
        fireEvent.submit(form);

        // Wait for results to appear
        await waitFor(() => {
            expect(screen.getByText('Lionel Messi')).toBeInTheDocument();
        });

        // Click on page 2
        const page2Button = screen.getByText('2');
        fireEvent.click(page2Button);

        // Page 2 should show the 6th player
        expect(screen.getByText('Erling Haaland')).toBeInTheDocument();

        // First player should not be visible anymore
        expect(screen.queryByText('Lionel Messi')).not.toBeInTheDocument();
    });

    // Test 10: Error handling - API call fails
    it('handles API errors gracefully', async () => {
        // Setup mock to throw an error
        mockSearchPlayers.mockRejectedValue(new Error('API error'));

        // Spy on console.error
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        render(<SearchBar />);

        // Submit the form
        const searchInput = screen.getByPlaceholderText('Search for players by name...');
        const form = searchInput.closest('form');

        await userEvent.type(searchInput, 'Messi');
        fireEvent.submit(form);

        // Wait for the API call to complete
        await waitFor(() => {
            // Check if error was logged
            expect(consoleSpy).toHaveBeenCalledWith(
                'Error fetching players:',
                expect.any(Error)
            );

            // Loading indicator should be gone
            expect(screen.queryByText('Loading results...')).not.toBeInTheDocument();
        });

        // Clean up spy
        consoleSpy.mockRestore();
    });

    // Test 11: Component works without onSelectPlayer prop
    it('handles missing onSelectPlayer prop gracefully', async () => {
        // Setup mock to return data
        mockSearchPlayers.mockResolvedValue([mockPlayers[0]]);

        // Spy on console.log
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });

        // Render without onSelectPlayer prop
        render(<SearchBar />);

        // Submit the form
        const searchInput = screen.getByPlaceholderText('Search for players by name...');
        const form = searchInput.closest('form');

        await userEvent.type(searchInput, 'Messi');
        fireEvent.submit(form);

        // Wait for results
        await waitFor(() => {
            expect(screen.getByText('Lionel Messi')).toBeInTheDocument();
        });

        // Click on player
        fireEvent.click(screen.getByText('Lionel Messi'));

        // Should log that no handler was provided
        expect(consoleSpy).toHaveBeenCalledWith(
            'Player selected but no handler provided:',
            expect.anything()
        );

        // Clean up spy
        consoleSpy.mockRestore();
    });
});