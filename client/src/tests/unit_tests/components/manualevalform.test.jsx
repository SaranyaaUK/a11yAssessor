/**
 * 
 * manualevalform.test.jsx
 * 
 * Tests the manual eval form
 * 
*/
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ServerAPI from '../../../apis/ServerAPI';
import { AppContext } from '../../../context/AppContext';
import '@testing-library/jest-dom';
// Component under test
import ManualEvaluationForm from '../../../components/ManualEvaluationForm';


/**
 *  Mock modules
 */

// Mocking ServerAPI
jest.mock('../../../apis/ServerAPI', () => ({
    get: jest.fn(),
    post: jest.fn(),
}));

// Mock the react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn().mockImplementation(() => ({
        state: { site_id: 1, url: 'http://example.com' },
        pathname: '/dashboard/site/1',
    })),
    useNavigate: jest.fn(),
}));

// Mocking ManualEvalFormBody component
jest.mock('../../../components/ManualEvalFormBody',
    () => () => <div>Mocked ManualEvalFormBody</div>);

// Mock data
const mockEvalFormDetails = {
    groupedGuidelines: {
        Perceivable: [{ principle_name: "Perceivable", title: "Guideline 1", questions: [{ q_id: "1", q_text: "Question 1" }] }],
        Operable: [{ principle_name: "Operable", title: "Guideline 2", questions: [{ q_id: "2", q_text: "Question 2" }] }],
        Understandable: [{ principle_name: "Understandable", title: "Guideline 3", questions: [{ q_id: "3", q_text: "Question 3" }] }],
        Robust: [{ principle_name: "Robust", title: "Guideline 4", questions: [{ q_id: "4", q_text: "Question 4" }] }],
    },
    principles: [{ title: "Perceivable", description: "Description 1" }, { title: "Operable", description: "Description 2" }]
};

const mockFormResult = {
    Perceivable: {
        "Guideline 1": [{ title: "Guideline title", q_id: "1", result: "Pass", observation: "Observation 1" }]
    },
    Operable: {
        "Guideline 2": [{ title: "Guideline title", q_id: "2", result: "Not Sure", observation: "Observation 2" }]
    },
    Understandable: {
        "Guideline 3": [{ title: "Guideline title", q_id: "3", result: "Fail", observation: "Observation 3" }]
    },
    Robust: {
        "Guideline 4": [{ title: "Guideline title", q_id: "4", result: "Not Evaluated", observation: "Observation 4" }]
    }
};

//  Test the manual evaluation form
describe('ManualEvaluationForm', () => {
    beforeEach(() => {
        // Mock API responses
        ServerAPI.get.mockImplementation((url) => {
            if (url.includes('evalFormDetails')) {
                return Promise.resolve({ data: mockEvalFormDetails });
            } else if (url.includes('results')) {
                return Promise.resolve({ data: { result: mockFormResult } });
            }
            return Promise.reject(new Error('Invalid request'));
        });

        ServerAPI.post.mockResolvedValue({ data: {} });

        jest.spyOn(require("react-router-dom"), "useLocation").mockImplementation(() => ({
            state: { site_id: 1, url: 'http://example.com' },
            pathname: '/dashboard/site/1',
        }));
    });

    const renderComponent = () => {
        const mockSetEvalFormData = jest.fn();
        render(
            <AppContext.Provider value={{ evalFormData: {}, setEvalFormData: mockSetEvalFormData }}>
                <MemoryRouter initialEntries={[{ state: { site_id: 1, url: 'http://example.com' } }]}>
                    <ManualEvaluationForm />
                </MemoryRouter>
            </AppContext.Provider>
        );
    };

    // Test the component rendering
    test('renders the form and handles actions', async () => {

        renderComponent();

        await waitFor(() => expect(screen.getByText('Mocked ManualEvalFormBody')).toBeInTheDocument());

        expect(screen.getByText('Target webpage:')).toBeInTheDocument();
        expect(screen.getByText('http://example.com')).toBeInTheDocument();

        // Simulate button clicks
        fireEvent.click(screen.getByText('Save'));
        await waitFor(() => expect(ServerAPI.post).toHaveBeenCalledTimes(1));

        fireEvent.click(screen.getByText('Reset'));
        expect(screen.getByText('Reset Confirmation')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Confirm'));
        await waitFor(() => expect(ServerAPI.post).toHaveBeenCalledTimes(2));

        fireEvent.click(screen.getByText('Cancel'));
        await waitFor(() => expect(screen.queryByText('Reset Confirmation')).not.toBeInTheDocument());
    });

    // Test the navigation to home dashboard
    test('navigates to Home when Home button is clicked', async () => {

        const mockNavigate = jest.fn();
        jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);

        renderComponent();

        // Wait for component to load
        await waitFor(() => expect(screen.getByText('Mocked ManualEvalFormBody')).toBeInTheDocument());

        const homeButton = screen.getAllByText(/Home/i);
        fireEvent.click(homeButton[0]);

        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');

        fireEvent.click(homeButton[1]);
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard/1');
    });

    // Test the finish option rendering
    test('renders the form and handles actions', async () => {

        const mockNavigate = jest.fn();
        jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);

        renderComponent();

        await waitFor(() => expect(screen.getByText('Mocked ManualEvalFormBody')).toBeInTheDocument());

        // Simulate button clicks to go to the end of the evaluation
        fireEvent.click(screen.getByText('Next'));
        fireEvent.click(screen.getByText('Next'));
        fireEvent.click(screen.getByText('Next'));

        fireEvent.click(screen.getByText('Finish'));
        await waitFor(() => expect(ServerAPI.post).toHaveBeenCalledTimes(1));
        expect(mockNavigate).toHaveBeenCalledWith('/result/manual/1', {
            state: { site_id: 1, url: 'http://example.com' }
        });
    });
});
