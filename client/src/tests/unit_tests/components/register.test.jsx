/**
 * 
 * register.test.jsx
 * 
 * Tests the register page content
 * 
*/
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ServerAPI from '../../../apis/ServerAPI';
import validator from 'validator';
// Component under test
import RegisterPageBody from '../../../components/RegisterPageBody';


/**
 *  Mock modules
 */

// Mock the react-router-dom
jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
    generatePath: jest.requireActual('react-router-dom').generatePath,
}));

// Mock the toast method
jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
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

//  Test the register page content
describe('RegisterPageBody Component', () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        useNavigate.mockReturnValue(mockNavigate);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const renderComponent = () => render(<RegisterPageBody />);

    // Check the page rendering
    test('renders the registration form with input fields and button', () => {
        renderComponent();

        // Check if form fields are rendered
        expect(screen.getByLabelText('First Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Email address')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();

        // Check if the Register button is rendered
        expect(screen.getByText('Register')).toBeInTheDocument();
    });

    // Check the registration process
    test('handles successful registration', async () => {
        validator.isEmail.mockReturnValue(true);
        ServerAPI.post.mockResolvedValueOnce({
            data: {
                success: true,
                message: 'Registration successful',
            },
        });

        renderComponent();

        // Simulate data input
        fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'john.doe@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });

        fireEvent.click(screen.getByText('Register'));

        await waitFor(() => expect(ServerAPI.post).toHaveBeenCalledWith(
            '/auth/register',
            JSON.stringify({
                firstname: 'John',
                lastname: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                confirmPassword: 'password123',
            }),
            { headers: { 'Content-type': 'application/json' } }
        ));

        expect(mockNavigate).toHaveBeenCalledWith('/login');
        expect(toast.success).toHaveBeenCalledWith('Registration successful', { position: 'top-center' });
    });

    // Validate invalid email
    test('shows error for invalid email', async () => {
        validator.isEmail.mockReturnValue(false);

        renderComponent();

        // Simulate invalid email input entry
        fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'invalid-email' } });
        fireEvent.click(screen.getByText('Register'));

        await waitFor(() => expect(toast.error).toHaveBeenCalledWith(
            'Enter a valid email, in the form as shown in the Email address input field',
            { position: 'top-center' }
        ));

        expect(ServerAPI.post).not.toHaveBeenCalled();
    });

    // Validate password mismatch
    test('shows error for non-matching passwords', async () => {
        validator.isEmail.mockReturnValue(true);

        renderComponent();

        // Simulate mismatching password entry
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'differentpassword' } });
        fireEvent.click(screen.getByText('Register'));

        await waitFor(() => expect(toast.error).toHaveBeenCalledWith(
            'Password and Confirm Password do not match',
            { position: 'top-center' }
        ));

        expect(ServerAPI.post).not.toHaveBeenCalled();
    });

    // Validate for password correctness
    test('shows error for invalid password', async () => {
        validator.isEmail.mockReturnValue(true);

        renderComponent();

        // Simulate invalid password entry
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'short' } });
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'short' } });
        fireEvent.click(screen.getByText('Register'));

        await waitFor(() => expect(toast.error).toHaveBeenCalledWith(
            'Password must be 6-15 characters long and contain only alphanumeric characters',
            { position: 'top-center' }
        ));

        expect(ServerAPI.post).not.toHaveBeenCalled();
    });

    // Check for registration failure
    test('handles failed registration', async () => {
        validator.isEmail.mockReturnValue(true);
        ServerAPI.post.mockResolvedValueOnce({
            data: {
                success: false,
                message: 'Registration failed',
            },
        });

        renderComponent();

        // Simulate registration details entry
        fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'john.doe@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByText('Register'));

        await waitFor(() => expect(ServerAPI.post).toHaveBeenCalled());

        expect(toast.error).toHaveBeenCalledWith('Registration failed', { position: 'top-center' });
    });
});
