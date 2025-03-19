// About.test.jsx
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock the CSS import - no need to return anything for CSS imports
vi.mock('../../src/styles/About.css', () => ({}));

// Mock all image imports
vi.mock('../../src/images/Angel.png', () => ({
    default: 'mocked-angel-image'
}));
vi.mock('../../src/images/carmani.png', () => ({
    default: 'mocked-carmani-image'
}));
vi.mock('../../src/images/Anthony.jpeg', () => ({
    default: 'mocked-anthony-image'
}));
vi.mock('../../src/images/Nate.png', () => ({
    default: 'mocked-nate-image'
}));
vi.mock('../../src/images/Jennifer.png', () => ({
    default: 'mocked-jennifer-image'
}));

// Import the actual component
import About from '../../src/pages/About';

describe('About Component', () => {
    it('renders without crashing', () => {
        render(<About />);
        expect(document.querySelector('.page-container')).toBeTruthy();
    });

    it('displays the title', () => {
        render(<About />);
        expect(screen.getByText('About FutureStars')).toBeTruthy();
    });

    it('displays all team members', () => {
        render(<About />);
        expect(screen.getByText('Angel Duerto')).toBeTruthy();
        expect(screen.getByText('Anthony Montesdeoca')).toBeTruthy();
        expect(screen.getByText('Carmani Harris-Jackson')).toBeTruthy();
        expect(screen.getByText('Nate Sherer')).toBeTruthy();
        expect(screen.getByText('Jennifer Guzman')).toBeTruthy();
    });
});