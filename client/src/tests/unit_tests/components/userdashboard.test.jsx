/**
 * 
 * userdashboard.test.jsx
 * 
 * Tests the userdashboard content
 * 
*/
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AppContext } from '../../../context/AppContext';
import ServerAPI from '../../../apis/ServerAPI';
import { toast } from 'react-toastify';
// Component under test
import UserDashboardBody from '../../../components/UserDashboardBody';

/**
 *  Mock modules
 */
// Mock the toast method
jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
    },
}));

// Mock the react-router-dom
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => jest.fn(),
}));

// Mock the server api
jest.mock('../../../apis/ServerAPI', () => ({
    get: jest.fn(),
    post: jest.fn(),
}));

// Mock data
const mockUser = { first_name: 'John', last_name: 'Doe' };
const mockSites = [
    { id: 1, name: 'Site 1', url: 'https://site1.com' },
    { id: 2, name: 'Site 2', url: 'https://site2.com' },
];

const renderComponent = (contextValue) =>
    render(
        <AppContext.Provider value={contextValue}>
            <UserDashboardBody />
        </AppContext.Provider>
    );

// Test the user dashboard content
describe('UserDashboardBody Component', () => {
    const contextValue = {
        sitesList: mockSites,
        setSitesList: jest.fn(),
        addSite: jest.fn(),
        siteImageList: {},
        setSitesImage: jest.fn(),
    };

    beforeEach(() => {
        // Mock the API call to return a user object
        ServerAPI.get.mockResolvedValueOnce({
            // Get the user data
            data: {
                success: true,
                user: mockUser,
            },
        }).mockResolvedValueOnce({
            // Get the sites list added by the user
            data: {
                success: true,
                sites: mockSites,
            },
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test the dashboard rendering
    test('renders user dashboard with user information and site list', async () => {
        // Get API data
        ServerAPI.get.mockResolvedValueOnce({
            data: {
                success: true,
                user: mockUser,
            },
        }).mockResolvedValueOnce({
            data: {
                success: true,
                sites: mockSites,
            },
        })

        renderComponent(contextValue);

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /welcome, john doe/i })).toBeInTheDocument();
        });
        expect(screen.getByPlaceholderText('Search site')).toBeInTheDocument();
        expect(screen.getByText(mockSites[0].name.toUpperCase())).toBeInTheDocument();
        expect(screen.getByText(mockSites[1].name.toUpperCase())).toBeInTheDocument();
    });

    // Test the modal dialog rendering
    test('displays the Add Site modal when the Add Site button is clicked', async () => {
        renderComponent(contextValue);

        fireEvent.click(screen.getByText(/add site/i));

        await waitFor(() => {
            expect(screen.getByText(/add webpage/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/sample webpage page/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/https:\/\/www.example.com\/home/i)).toBeInTheDocument();
        });
    });

    // Test the modal dialog functionalities
    test('handles form submission and validation for adding a new site', async () => {
        renderComponent(contextValue);

        fireEvent.click(screen.getByText(/add site/i));

        await waitFor(() => {
            expect(screen.getByText(/add webpage/i)).toBeInTheDocument();
        });

        fireEvent.change(screen.getByPlaceholderText(/sample webpage page/i), {
            target: { value: 'New Site' },
        });
        fireEvent.change(screen.getByPlaceholderText(/https:\/\/www.example.com\/home/i), {
            target: { value: 'https://newsite.com' },
        });

        ServerAPI.post.mockResolvedValueOnce({
            data: {
                success: true,
                site: { id: 3, name: 'New Site', url: 'https://newsite.com' },
            },
        });

        fireEvent.click(screen.getByText(/add/i, { selector: 'button' }));

        await waitFor(() => {
            expect(ServerAPI.post).toHaveBeenCalledWith(
                '/site',
                JSON.stringify({ name: 'New Site', url: 'https://newsite.com' }),
                {
                    headers: {
                        'token': localStorage.getItem('token'),
                        'Content-type': 'application/json',
                    },
                }
            );
        });

        expect(contextValue.addSite).toHaveBeenCalledWith({ id: 3, name: 'New Site', url: 'https://newsite.com' });
        expect(toast.info).toHaveBeenCalledWith('Site Added', { position: 'top-center' });
    });

    // Test the modal dialog validation
    test('shows error when adding a site with an invalid URL', async () => {
        renderComponent(contextValue);

        fireEvent.click(screen.getByText(/add site/i));

        await waitFor(() => {
            expect(screen.getByText(/add webpage/i)).toBeInTheDocument();
        });

        fireEvent.change(screen.getByPlaceholderText(/sample webpage page/i), {
            target: { value: 'New Site' },
        });
        fireEvent.change(screen.getByPlaceholderText(/https:\/\/www.example.com\/home/i), {
            target: { value: 'invalid-url' },
        });

        fireEvent.click(screen.getByText(/add/i, { selector: 'button' }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                'Enter a valid URL, in the form as shown in the URL input field',
                { position: 'top-center' }
            );
        });

        expect(ServerAPI.post).not.toHaveBeenCalled();
    });

    // Test the site addition failure
    test('handles failed site addition', async () => {
        renderComponent(contextValue);

        fireEvent.click(screen.getByText(/add site/i));

        await waitFor(() => {
            expect(screen.getByText(/add webpage/i)).toBeInTheDocument();
        });

        fireEvent.change(screen.getByPlaceholderText(/sample webpage page/i), {
            target: { value: 'New Site' },
        });
        fireEvent.change(screen.getByPlaceholderText(/https:\/\/www.example.com\/home/i), {
            target: { value: 'https://newsite.com' },
        });

        ServerAPI.post.mockResolvedValueOnce({
            data: {
                success: false,
                message: 'Failed to add site',
            },
        });

        fireEvent.click(screen.getByText(/add/i, { selector: 'button' }));

        await waitFor(() => {
            expect(ServerAPI.post).toHaveBeenCalled();
        });

        expect(toast.error).toHaveBeenCalledWith('Failed to add site', { position: 'top-center' });
        expect(contextValue.addSite).not.toHaveBeenCalled();
    });

    // Test - If user was unauthenticated (JWT expired)
    test('displays an error when failing to fetch user info', async () => {
        ServerAPI.get.mockRejectedValueOnce(new Error('Cannot retrieve user info, login again'));

        renderComponent(contextValue);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                'Cannot retrieve user info, login again',
                { position: 'top-center' }
            );
        });
    });

    //  Test - If user was authenticated but cannot get the site's list (Some server error)
    test('displays an error when failing to fetch site list', async () => {
        ServerAPI.get.mockResolvedValueOnce({
            data: {
                success: true,
                user: mockUser,
            },
        })
        ServerAPI.get.mockRejectedValueOnce(new Error('Cannot retrieve data!'));

        renderComponent(contextValue);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                'Cannot retrieve data!',
                { position: 'top-center' }
            );
        });
    });
});
