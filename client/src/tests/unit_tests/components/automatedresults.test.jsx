/**
 * 
 * automatedresults.test.jsx
 * 
 * Tests the automated result page
 * 
*/
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthenticationContext } from '../../../context/AppContext';
import ServerAPI from '../../../apis/ServerAPI';
// Component under test
import ResultPageBody from '../../../components/ResultPageBody';


/**
 *  Mock modules
 */

// Mock the react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

// Mock the server api
jest.mock('../../../apis/ServerAPI', () => ({
    get: jest.fn(),
}));

//  Test the result page content
describe('ResultPageBody Component', () => {
    // Mock result data
    const mockResults = {
        groupedErrors: {
            'Error Type 1': [{ context: 'Error context 1', selector: '.error-1', runnerExtras: { help: 'Error help 1', helpUrl: 'http://example.com/error1' } }],
        },
        groupedWarnings: {},
        groupedNotices: {},
    };

    // Render the component
    const renderComponent = (isAuthenticated, results = mockResults, url = 'http://example.com', siteid = '123') => {
        return render(
            <AuthenticationContext.Provider value={{ isAuthenticated }}>
                <ResultPageBody url={url} results={results} siteid={siteid} />
            </AuthenticationContext.Provider>
        );
    };

    beforeEach(() => {
        ServerAPI.get.mockResolvedValueOnce({ data: 'mockImageData' });
    })

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Check the component rendering for authenticated users
    it('renders errors, warnings, and notices tabs with appropriate content', async () => {
        renderComponent(true);

        // Check for the "Errors" tab and its content
        expect(screen.getByText('Errors')).toBeInTheDocument();
        expect(screen.getByText('Error Type 1'.toUpperCase())).toBeInTheDocument();
        expect(screen.getByText('Error help 1')).toBeInTheDocument();

        // Check for the "Warnings" tab with no warnings present
        await act(async () => {
            fireEvent.click(screen.getByText('Warnings'));
        });
        expect(screen.getByText('No Warnings found')).toBeInTheDocument();

        // Check for the "Notices" tab with no notices present
        await act(async () => {
            fireEvent.click(screen.getByText('Notices'));
        });
        expect(screen.getByText('No Notices found')).toBeInTheDocument();
    });

    // Check the component rendering for unauthenticated users
    it('prompts the user to log in to view warnings and notices if not authenticated', async () => {
        renderComponent(false);

        await act(async () => {
            fireEvent.click(screen.getByText('Warnings'));
        });
        expect(screen.getByText(/to view warnings/i)).toBeInTheDocument();

        await act(async () => {
            fireEvent.click(screen.getByText('Notices'));
        });
        expect(screen.getByText(/to view notices/i)).toBeInTheDocument();
    });

    // Check navigating back to user dashboard
    it('navigates to the dashboard on Home button click', async () => {
        const mockNavigate = jest.fn();
        jest.spyOn(require("react-router-dom"), "useNavigate").mockImplementation(() => mockNavigate);
        renderComponent(true);

        await act(async () => {
            fireEvent.click(screen.getByText('Home'));
        });

        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });

    // Check navigating back to site dashboard
    it('navigates to the site dashboard on Site Home button click', async () => {
        const mockNavigate = jest.fn();
        jest.spyOn(require("react-router-dom"), "useNavigate").mockImplementation(() => mockNavigate);

        renderComponent(true);

        await act(async () => {
            fireEvent.click(screen.getByText('Site Home'));
        });

        expect(mockNavigate).toHaveBeenCalledWith('/dashboard/123');
    });

    // Check the image display
    it('fetches and displays the webpage image', async () => {

        renderComponent(true);

        await waitFor(() => expect(ServerAPI.get).toHaveBeenCalledWith('/getDOMElementImage', {
            params: { url: 'http://example.com', width: 900, height: 900 },
        }));

        expect(screen.getByText('Snapshot of the webpage')).toBeInTheDocument();
    });
});
