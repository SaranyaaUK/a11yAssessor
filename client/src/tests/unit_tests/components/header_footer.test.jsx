/**
 * 
 * header_footer.test.jsx
 * 
 * Tests the header and footer components
 * 
*/
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthenticationContext } from '../../../context/AppContext';
// Component under test
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

// /**
//  *  Mock modules
//  */
// // Mock the react-router-dom
// jest.mock("react-router-dom", () => ({
//     ...jest.requireActual("react-router-dom"),
//     useNavigate: () => jest.fn(),
// }));

// Test the header component
describe('Header Component', () => {

    beforeEach(() => {
        // Mock the localstorage
        jest.spyOn(window.localStorage.__proto__, 'removeItem');
        window.localStorage.__proto__.removeItem = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const mockSetIsAuthenticated = jest.fn();

    const renderComponent = (isAuthenticated) => {
        return render(
            <AuthenticationContext.Provider value={{ isAuthenticated, setIsAuthenticated: mockSetIsAuthenticated }}>
                <Header />
            </AuthenticationContext.Provider>
        );
    };

    // Check the header component rendering
    test('header component rendering', () => {
        renderComponent(false);

        // Check rendered elements
        expect(screen.getByText('About Us')).toBeInTheDocument();
        expect(screen.getByText('Features')).toBeInTheDocument();
        expect(screen.getByText('a11yAssessor')).toBeInTheDocument();
    });

    // Check if the login text is shown if user is unathenticated
    test('renders login link when user is not authenticated', () => {
        renderComponent(false);

        // Check if the Login link is rendered
        expect(screen.getByText('Login')).toBeInTheDocument();
    });

    // Check if the logout text is shown if user is athenticated
    test('renders logout link when user is authenticated', () => {
        renderComponent(true);

        // Check if the Logout link is rendered
        expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    // Check logout callback
    test('calls logout function when logout link is clicked', () => {
        renderComponent(true);

        const logoutLink = screen.getByText('Logout');

        // Simulate a click on the logout link
        fireEvent.click(logoutLink);

        // Check if the mockSetIsAuthenticated was called with false
        expect(mockSetIsAuthenticated).toHaveBeenCalledWith(false);

        // Check if the token was removed from local storage
        expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    });

    // Check the about and features page navigation
    test('header component rendering', () => {
        renderComponent(false);

        const aboutLink = screen.getByText('About Us');
        const featuresLink = screen.getByText('Features');

        // Check the navigation
        expect(aboutLink.getAttribute("href")).toBe('/about');
        expect(featuresLink.getAttribute("href")).toBe('/features');
    });
});

// Test the footer component
describe('Footer Component', () => {
    const mockSetIsAuthenticated = jest.fn();

    const renderComponent = (isAuthenticated) => {
        return render(
            <AuthenticationContext.Provider value={{ isAuthenticated, setIsAuthenticated: mockSetIsAuthenticated }}>
                <Footer />
            </AuthenticationContext.Provider>
        );
    };

    // Check if the login text is shown if user is unathenticated
    test('renders login link when user is not authenticated', () => {
        renderComponent(false);

        // Check if the Login link is rendered
        expect(screen.getByText('Login')).toBeInTheDocument();
    });

    // Check if the logout text is shown if user is athenticated
    test('renders logout link when user is authenticated', () => {
        renderComponent(true);

        // Check if the Logout link is rendered
        expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    // Check if the logout text is shown if user is athenticated
    test('calls logout function when logout link is clicked', () => {
        renderComponent(true);

        const logoutLink = screen.getByText('Logout');

        // Simulate a click on the logout link
        fireEvent.click(logoutLink);

        // Check if the mockSetIsAuthenticated was called with false
        expect(mockSetIsAuthenticated).toHaveBeenCalledWith(false);

        // Check if the token was removed from local storage
        expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    });

    // Check logo rendering
    test('renders company name and logo', () => {
        renderComponent(false);

        // Check if the logo and company name are rendered
        expect(screen.getByAltText('logo')).toBeInTheDocument();
        // © Alt+1069
        expect(screen.getByText('a11yAssessor © 2024')).toBeInTheDocument();
    });

    // Check the contact details
    test('renders contact information', () => {
        renderComponent(false);

        // Check if the contact information is rendered
        expect(screen.getByText('a11yAssessor@outlook.com')).toBeInTheDocument();
    });

    // Check the about and features page navigation
    test('header component rendering', () => {
        renderComponent(false);

        const aboutLink = screen.getByText('About Us');
        const featuresLink = screen.getByText('Features');

        // Check the navigation
        expect(aboutLink.getAttribute("href")).toBe('/about');
        expect(featuresLink.getAttribute("href")).toBe('/features');
    });
});
