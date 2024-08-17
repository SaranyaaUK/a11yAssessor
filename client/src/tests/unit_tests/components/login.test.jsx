/**
 * 
 * login.test.jsx
 * 
 * Tests the login page content
 * 
*/
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthenticationContext } from '../../../context/AppContext';
import ServerAPI from '../../../apis/ServerAPI';
import { toast } from 'react-toastify';
import validator from 'validator';
// Component under test
import LoginPageBody from '../../../components/LoginPageBody';


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

// Mock the validator
jest.mock('validator', () => ({
    isEmail: jest.fn(),
}));

// Mock the server api
jest.mock('../../../apis/ServerAPI', () => ({
    post: jest.fn(),
}));

describe('LoginPageBody Component', () => {

    beforeEach(() => {
        // Mock the localstorage
        jest.spyOn(window.localStorage.__proto__, 'setItem');
        window.localStorage.__proto__.setItem = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const mockSetIsAuthenticated = jest.fn();

    const renderComponent = () => {
        return render(
            <AuthenticationContext.Provider value={{ setIsAuthenticated: mockSetIsAuthenticated }}>
                <LoginPageBody />
            </AuthenticationContext.Provider>
        );
    };

    // Check the login page rendering
    test('renders login form with email and password inputs', () => {
        renderComponent();

        // Check if email, password inputs and buttons are rendered
        expect(screen.getByLabelText('Email address')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByText('Register')).toBeInTheDocument();
        expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    });

    // Check logging in
    test('handles successful login', async () => {
        const mockResponse = {
            data: {
                token: 'fakeToken',
                message: 'Login successful',
            },
        };
        ServerAPI.post.mockResolvedValueOnce(mockResponse);

        renderComponent();

        // Simulate email and password entry
        fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });

        // Simulate login button click
        fireEvent.click(screen.getByText('Login'));

        // Check callback triggered
        await waitFor(() => expect(ServerAPI.post).toHaveBeenCalledWith(
            '/auth/login',
            JSON.stringify({ email: 'test@example.com', password: 'password' }),
            { headers: { 'Content-type': 'application/json' } }
        ));

        // Successful login should update the token in the localstorage
        expect(localStorage.setItem).toHaveBeenCalledWith('token', 'fakeToken');
        expect(mockSetIsAuthenticated).toHaveBeenCalledWith(true);
        expect(toast.success).toHaveBeenCalledWith('Login successful');
    });

    // Test login failure
    test('handles unsuccessful login', async () => {
        ServerAPI.post.mockResolvedValueOnce({ data: null });

        renderComponent();

        // Simulate entry with wrong password
        fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpassword' } });

        // Simulate login button click
        fireEvent.click(screen.getByText('Login'));

        await waitFor(() => expect(ServerAPI.post).toHaveBeenCalled());

        expect(mockSetIsAuthenticated).toHaveBeenCalledWith(false);
        expect(toast.error).toHaveBeenCalledWith('Invalid email or password! Check your credentials', { position: 'top-center' });
    });

    // Test forgot password button
    test('handles password reset with valid email', async () => {
        validator.isEmail.mockReturnValueOnce(true);
        ServerAPI.post.mockResolvedValueOnce({ data: { success: true, message: 'Reset link sent' } });

        renderComponent();

        fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'test@example.com' } });

        // Simulate forgot password button click
        fireEvent.click(screen.getByText('Forgot password?'));

        await waitFor(() => expect(ServerAPI.post).toHaveBeenCalledWith(
            '/resetpassword',
            JSON.stringify({ email: 'test@example.com' }),
            { headers: { 'Content-type': 'application/json' } }
        ));

        expect(toast.info).toHaveBeenCalledWith('Reset link sent', { position: 'top-center' });
    });

    // Test forgot password with invalid email
    test('handles password reset with invalid email', async () => {
        validator.isEmail.mockReturnValueOnce(false);

        renderComponent();

        fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'invalidEmail' } });

        // Simulate forgot password button click
        fireEvent.click(screen.getByText('Forgot password?'));

        await waitFor(() => expect(ServerAPI.post).not.toHaveBeenCalled());

        expect(toast.error).toHaveBeenCalledWith('Enter valid email to proceed', { position: 'top-center' });
    });

    // Test forgot password with unregistered email 
    test('handles failed password reset', async () => {
        validator.isEmail.mockReturnValueOnce(true);
        ServerAPI.post.mockResolvedValueOnce({ data: { success: false, message: 'Email not found' } });

        renderComponent();

        fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'test@example.com' } });

        // Simulate forgot password button click
        fireEvent.click(screen.getByText('Forgot password?'));

        await waitFor(() => expect(ServerAPI.post).toHaveBeenCalled());

        expect(toast.error).toHaveBeenCalledWith('Email not found', { position: 'top-center' });
    });
});
