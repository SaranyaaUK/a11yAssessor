/**
 * 
 * manualresult.test.jsx
 * 
 * Tests the manual result page
 * 
*/
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, generatePath } from 'react-router-dom';
import ServerAPI from '../../../apis/ServerAPI';
import '@testing-library/jest-dom';
// Component under test
import SiteManualResultPage from '../../../components/ManualResultBody';

/**
 *  Mock modules
 */

// Mock the react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn().mockImplementation(() => ({
        state: { site_id: 1, url: 'http://example.com' },
        pathname: '/dashboard/site/1',
    })),
    useNavigate: jest.fn(),
}))

// Mock the server api
jest.mock('../../../apis/ServerAPI', () => ({
    get: jest.fn(),
    post: jest.fn(),
}));

// Mock the data
const mockData = {
    result: {
        "Perceivable": {
            "Guideline 1": [
                { title: "Criterion 1", result: "Pass", observation: "Observation 1" },
                { title: "Criterion 2", result: "Fail", observation: "Observation 2" },
            ]
        },
        "Operable": {
            "Guideline 2": [
                { title: "Criterion 3", result: "Pass", observation: "Observation 3" }
            ]
        }
    }
};

// Test the site manual result page
describe('SiteManualResultPage', () => {
    const mockLocation = {
        state: { site_id: 1, url: 'http://example.com' }
    };

    beforeEach(() => {
        ServerAPI.get.mockResolvedValue({ data: mockData });

        jest.spyOn(require("react-router-dom"), "useLocation").mockImplementation(() => ({
            state: { site_id: 1, url: 'http://example.com' },
            pathname: '/dashboard/site/1',
        }));
    });

    // Render the component
    const renderComponent = () => {
        render(
            <MemoryRouter initialEntries={[{ pathname: '/result/manual', state: mockLocation.state }]}>
                <SiteManualResultPage />
            </MemoryRouter>
        );
    };

    // Test the component rendering
    test('renders SiteManualResultPage and displays results in the table', async () => {
        renderComponent();
        // Check if the results heading is rendered
        expect(screen.getByText(/Results/i)).toBeInTheDocument();

        // Wait for table rows to be rendered
        await waitFor(() => {
            expect(screen.getByText(/Perceivable/i)).toBeInTheDocument();
            expect(screen.getByText(/Criterion 1/i)).toBeInTheDocument();
            expect(screen.getByText(/Observation 1/i)).toBeInTheDocument();
        });
    });

    // Test the navigation to home page
    test('navigates to Home when Home button is clicked', async () => {

        const mockNavigate = jest.fn();
        jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);

        renderComponent();
        // Wait for component to load
        await waitFor(() => screen.getByText(/Results/i));

        // Click the Home button
        fireEvent.click(screen.getByText('Home'));

        // Check that the history was updated with the Home route
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });

    // Test the navigation to site home page
    test('navigates to Site Home when Site Home button is clicked', async () => {

        const mockNavigate = jest.fn();
        jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);

        renderComponent();
        // Wait for component to load
        await waitFor(() => screen.getByText(/Results/i));

        // Click the Site Home button
        fireEvent.click(screen.getByText('Site Home'));

        // Check that the history was updated with the Site Home route
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard/1');
    });
});
