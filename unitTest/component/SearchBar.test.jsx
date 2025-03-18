import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from '../../src/components/SearchBar'; // Adjust path as needed
import * as FootballAPI from '../../src/services/FootballAPI'; // Import the entire module

// Create a spy on the searchPlayers function
vi.spyOn(FootballAPI, 'searchPlayers');

describe('SearchBar Component', () => {
    // Sample mock data that matches the structure in your component
    const mockPlayers = [
        {
            player: {
                id: 1,
                name: 'Lionel Messi',
                photo: 'messi.jpg',
            }
        },
        {
            player: {
                id: 2,
                name: 'Cristiano Ronaldo',
                photo: 'ronaldo.jpg',
            }
        }
    ];

    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks();
    });

    // Test 1: Basic rendering
    it('renders search input correctly', () => {
        render(<SearchBar />);
        const searchInput = screen.getByPlaceholderText('Search for players by name...');
        expect(searchInput).toBeInTheDocument();
    });

    // Test 2: Search functionality
    it('calls searchPlayers when form is submitted', async () => {
        // Setup the mock to return data
        FootballAPI.searchPlayers.mockResolvedValue([]);

        render(<SearchBar />);

        // Get input and type in it
        const searchInput = screen.getByPlaceholderText('Search for players by name...');
        fireEvent.change(searchInput, { target: { value: 'Messi' } });

        // Submit the form
        const form = searchInput.closest('form');
        fireEvent.submit(form);

        // Check if API was called
        expect(FootballAPI.searchPlayers).toHaveBeenCalledWith('Messi');
    });

    // Test 3: Loading state
    it('shows loading state during API call', async () => {
        // Create a promise that won't resolve immediately
        let resolvePromise;
        const apiPromise = new Promise(resolve => {
            resolvePromise = resolve;
        });

        // Setup the mock
        FootballAPI.searchPlayers.mockImplementation(() => apiPromise);

        render(<SearchBar />);

        // Submit search
        const searchInput = screen.getByPlaceholderText('Search for players by name...');
        fireEvent.change(searchInput, { target: { value: 'Test' } });
        fireEvent.submit(searchInput.closest('form'));

        // Check for loading state
        expect(screen.getByText('Loading results...')).toBeInTheDocument();

        // Resolve the promise to clean up
        resolvePromise([]);
    });

    // Test 4: Displaying results
    it('displays results after API returns data', async () => {
        // Setup mock
        FootballAPI.searchPlayers.mockResolvedValue(mockPlayers);

        render(<SearchBar />);

        // Submit search
        const searchInput = screen.getByPlaceholderText('Search for players by name...');
        fireEvent.change(searchInput, { target: { value: 'Test' } });
        fireEvent.submit(searchInput.closest('form'));

        // Wait for results
        await waitFor(() => {
            const messiElement = screen.getByText('Lionel Messi');
            expect(messiElement).toBeInTheDocument();
        });
    });

    // Test 5: Player selection
    it('calls onSelectPlayer when a player is clicked', async () => {
        // Setup mock
        FootballAPI.searchPlayers.mockResolvedValue(mockPlayers);

        // Create mock callback
        const mockSelectPlayer = vi.fn();

        render(<SearchBar onSelectPlayer={mockSelectPlayer} />);

        // Submit search
        const searchInput = screen.getByPlaceholderText('Search for players by name...');
        fireEvent.change(searchInput, { target: { value: 'Test' } });
        fireEvent.submit(searchInput.closest('form'));

        // Wait for results and click a player
        await waitFor(() => {
            const messiElement = screen.getByText('Lionel Messi');
            expect(messiElement).toBeInTheDocument();

            // Click on player
            fireEvent.click(messiElement);

            // Check if callback was called
            expect(mockSelectPlayer).toHaveBeenCalledWith(mockPlayers[0]);
        });
    });
});