/**
 * 
 * forgotpassword.test.jsx
 * 
 * Tests the forgotpassword page content
 * 
*/
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import ServerAPI from '../../../apis/ServerAPI';
import { toast } from 'react-toastify';
// Component under test
import ForgotPasswordBody from '../../../components/ForgotPasswordBody';

/**
 *  Mock modules
 */

// Mock the react-router-dom
jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
    useLocation: jest.fn(),
    generatePath: jest.requireActual('react-router-dom').generatePath,
}));

// Mock the toast method
jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

// Mock the server api
jest.mock('../../../apis/ServerAPI', () => ({
    post: jest.fn(),
}));

//  Test the password reset page content
describe('ForgotPasswordBody Component', () => {
    const mockNavigate = jest.fn();
    const mockLocation = { pathname: '/reset-password-token' };

    beforeEach(() => {
        useNavigate.mockReturnValue(mockNavigate);
        useLocation.mockReturnValue(mockLocation);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const renderComponent = () => render(<ForgotPasswordBody />);

    // Check the page rendering
    test('renders the reset password form with input fields and button', () => {
        renderComponent();

        // Check if form fields are rendered
        expect(screen.getByLabelText('New Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirm New Password')).toBeInTheDocument();

        // Check if the Reset button is rendered
        expect(screen.getByText('Reset')).toBeInTheDocument();
    });

    // Check password reset
    test('handles successful password reset', async () => {
        ServerAPI.post.mockResolvedValueOnce({
            data: {
                success: true,
                message: 'Password reset successful',
            },
        });

        renderComponent();

        fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText('Confirm New Password'), { target: { value: 'password123' } });

        // Simulate reset button click
        fireEvent.click(screen.getByText('Reset'));

        await waitFor(() => expect(ServerAPI.post).toHaveBeenCalledWith(
            '/reset-password-token',
            JSON.stringify({
                password: 'password123',
                confirmPassword: 'password123',
            }),
            { headers: { 'Content-type': 'application/json' } }
        ));

        expect(mockNavigate).toHaveBeenCalledWith('/login');
        expect(toast.success).toHaveBeenCalledWith('Password reset successful', { position: 'top-center' });
    });

    // Validate password mismatch
    test('shows error for non-matching passwords', async () => {
        renderComponent();

        fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText('Confirm New Password'), { target: { value: 'differentpassword' } });

        // Simulate reset button click
        fireEvent.click(screen.getByText('Reset'));

        await waitFor(() => expect(toast.error).toHaveBeenCalledWith(
            'Password and Confirm Password do not match',
            { position: 'top-center' }
        ));

        expect(ServerAPI.post).not.toHaveBeenCalled();
    });

    // Validate invalid password format
    test('shows error for invalid password', async () => {
        renderComponent();

        fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'short' } });
        fireEvent.change(screen.getByLabelText('Confirm New Password'), { target: { value: 'short' } });

        // Simulate reset button click
        fireEvent.click(screen.getByText('Reset'));

        await waitFor(() => expect(toast.error).toHaveBeenCalledWith(
            'Password must be 6-15 characters long and contain only alphanumeric characters',
            { position: 'top-center' }
        ));

        expect(ServerAPI.post).not.toHaveBeenCalled();
    });

    // Validate failed password resst
    test('handles failed password reset', async () => {
        ServerAPI.post.mockResolvedValueOnce({
            data: {
                success: false,
                message: 'Password reset failed',
            },
        });

        renderComponent();

        fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText('Confirm New Password'), { target: { value: 'password123' } });

        // Simulate reset button click
        fireEvent.click(screen.getByText('Reset'));

        await waitFor(() => expect(ServerAPI.post).toHaveBeenCalled());

        expect(toast.error).toHaveBeenCalledWith('Password reset failed', { position: 'top-center' });
    });
});
