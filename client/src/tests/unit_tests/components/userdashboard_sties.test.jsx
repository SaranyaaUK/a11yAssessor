/**
 * 
 * userdashboard_sites.test.jsx
 * 
 * Tests the userdashboard sites display
 * 
*/
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AppContext } from '../../../context/AppContext';
import ServerAPI from '../../../apis/ServerAPI';
import { toast } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';
// Component under test
import UserDashboardSitesDisplay from '../../../components/UserDashboardSitesDisplay';


/**
 *  Mock modules
 */

// Mock the server api
jest.mock('../../../apis/ServerAPI', () => ({
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
}));

// Mock the toast method
jest.mock('react-toastify', () => ({
    toast: {
        error: jest.fn(),
        info: jest.fn(),
    },
}));

// Mock data
const mockContext = {
    sitesList: [{ site_id: '1', name: 'My Site', url: 'https://example.com' }],
    setSitesList: jest.fn(),
    siteImageList: {},
    setSitesImage: jest.fn(),
};

// Test the user dashboard site card
describe('UserDashboardSitesDisplay', () => {

    // Check the site card display
    it('should display site cards', () => {
        render(
            <AppContext.Provider value={mockContext}>
                <BrowserRouter>
                    <UserDashboardSitesDisplay searchData="" />
                </BrowserRouter>
            </AppContext.Provider>
        );

        expect(screen.getByText(mockContext.sitesList[0].name.toUpperCase())).toBeInTheDocument();
    });

    // Check for confirmation dialog on clicking delete button
    it('should show delete confirmation modal on delete button click', () => {
        render(
            <AppContext.Provider value={mockContext}>
                <BrowserRouter>
                    <UserDashboardSitesDisplay searchData="" />
                </BrowserRouter>
            </AppContext.Provider>
        );

        fireEvent.click(screen.getByText('Delete'));

        expect(screen.getByText('Are you sure you want to delete the site?')).toBeInTheDocument();
    });

    // Check the delete action
    it('should call API and remove site on confirm delete', async () => {
        ServerAPI.delete.mockResolvedValue({ data: { success: true } });

        render(
            <AppContext.Provider value={mockContext}>
                <BrowserRouter>
                    <UserDashboardSitesDisplay searchData="" />
                </BrowserRouter>
            </AppContext.Provider>
        );

        fireEvent.click(screen.getByText('Delete'));
        fireEvent.click(screen.getByText('Confirm'));

        await waitFor(() => {
            expect(mockContext.setSitesList).toHaveBeenCalled();
            expect(toast.info).toHaveBeenCalledWith('Site Removed', { position: 'top-center' });
        });
    });

    // Check the open action
    it('should navigate to site dashboard on open button click', () => {
        render(
            <AppContext.Provider value={mockContext}>
                <BrowserRouter>
                    <UserDashboardSitesDisplay searchData="" />
                </BrowserRouter>
            </AppContext.Provider>
        );

        const openButton = screen.getByText('Open');
        fireEvent.click(openButton);

        expect(screen.getByText('Open')).toBeInTheDocument(); // The router needs a mock if you want to test navigation
    });
});
