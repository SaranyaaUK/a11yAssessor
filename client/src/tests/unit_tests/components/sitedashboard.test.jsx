/**
 * 
 * sitedashboard.test.jsx
 * 
 * Tests the sitedashboard page content
 * 
*/
import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ServerAPI from '../../../apis/ServerAPI';
import { toast } from 'react-toastify';
import '@testing-library/jest-dom';
// Component under test
import SiteDashboardBody from '../../../components/SiteDashboardBody';

/**
 *  Mock modules
 */

// Mock the toast method
jest.mock('react-toastify', () => ({
    toast: {
        error: jest.fn(),
        info: jest.fn(),
    },
}));

// Mock the server api
jest.mock('../../../apis/ServerAPI', () => ({
    get: jest.fn(),
    post: jest.fn(),
}));

// Mock the react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn().mockImplementation(() => ({
        pathname: '/dashboard/site/1',
    })),
    useNavigate: jest.fn(),
}));

// Mock SiteEvaluationCard
jest.mock('../../../components/SiteEvaluationCard', () => (props) => (
    <div data-testid="SiteEvaluationCard">
        <div>{props.cardHeader}</div>
        <button
            onClick={() => props.evalBtnClick(props.site.site_id, props.site.url)}
            disabled={props.isButtonDisabled}
        >
            {props.isButtonDisabled ? 'Evaluate' : 'Re-Evaluate'}
        </button>
        <button onClick={props.resultBtnClick} disabled={props.isButtonDisabled}>
            {props.isResultloading ? 'Loading...' : 'Result'}
        </button>
    </div>
));

//  Test the sitedashboard page content
describe('SiteDashboardBody Component', () => {
    beforeEach(() => {
        ServerAPI.get.mockResolvedValueOnce({
            data: {
                site: { site_id: 1, name: 'Test Site', url: 'http://testsite.com' },
                timeStamp: { auto_time: '2024-01-01T10:00:00Z', manual_time: '2024-01-02T10:00:00Z' },
            },
        })

        ServerAPI.get.mockResolvedValueOnce({
            data: {
                result: true,
            },
        })

        ServerAPI.get.mockResolvedValueOnce({
            data: {
                result: true,
            },
        });

        ServerAPI.post.mockResolvedValueOnce({
            data: {
                result: true,
                timeStamp: { auto_time: '2024-01-01T10:00:00Z', manual_time: '2024-01-02T10:00:00Z' },
            },
        })

        jest.spyOn(require("react-router-dom"), "useLocation").mockImplementation(() => ({
            pathname: '/dashboard/site/1',
        }));

    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const renderComponent = () => {
        render(
            <Router>
                <SiteDashboardBody />
            </Router>
        )
    };

    // Check the component rendering
    test('renders the component and fetches site data', async () => {
        renderComponent();

        await waitFor(() => {
            expect(ServerAPI.get).toHaveBeenCalledTimes(4);
        });

        expect(screen.getByText(/Dashboard - Test Site/i)).toBeInTheDocument();
        expect(screen.getByText(/Automated Evaluation/i)).toBeInTheDocument();
        expect(screen.getByText(/Manual Evaluation/i)).toBeInTheDocument();
    });

    // Check the error handling
    test('handles API errors gracefully', async () => {

        ServerAPI.get.mockRejectedValueOnce(new Error('Failed to fetch data'));

        renderComponent();

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Cannot retrieve data!', {
                position: 'top-center',
            });
        });
    });

    // Check the automated evaluation card
    test('navigates to the automated evaluation result page when button is clicked', async () => {
        const mockNavigate = jest.fn();
        jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText(/Dashboard - Test Site/i)).toBeInTheDocument();
        });

        // Simulate auto result button
        const resultButtons = screen.queryAllByText('Result');
        expect(resultButtons).toHaveLength(2);
        fireEvent.click(resultButtons[0]);

        expect(mockNavigate).toHaveBeenCalledWith('/result/automated/1', {
            state: {
                url: 'http://testsite.com',
                site_id: 1,
            },
        });

        // Simulate auto eval button
        const evalButtons = screen.queryAllByText('Re-Evaluate');
        expect(evalButtons).toHaveLength(2);
        fireEvent.click(evalButtons[0]);

        await waitFor(() => {
            expect(ServerAPI.post).toHaveBeenCalled();
        });
    });

    // Check the manual evaluation card
    test('navigates to the manual evaluation result page when button is clicked', async () => {
        const mockNavigate = jest.fn();
        jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText(/Dashboard - Test Site/i)).toBeInTheDocument();
        });

        // Simulate manual result button
        const resultButtons = screen.queryAllByText('Result');
        expect(resultButtons).toHaveLength(2);
        fireEvent.click(resultButtons[1]);

        expect(mockNavigate).toHaveBeenCalledWith('/result/manual/1', {
            state: {
                url: 'http://testsite.com',
                site_id: 1,
            },
        });

        // Simulate manual eval button
        const evalButtons = screen.queryAllByText('Re-Evaluate');
        expect(evalButtons).toHaveLength(2);
        fireEvent.click(evalButtons[1]);

        expect(mockNavigate).toHaveBeenCalledWith('/manual/1', {
            state: {
                url: 'http://testsite.com',
                site_id: 1,
            },
        });
    });

    // Check the dashboard navigation
    it('navigates to the dashboard on Home button click', async () => {
        const mockNavigate = jest.fn();
        jest.spyOn(require("react-router-dom"), "useNavigate").mockImplementation(() => mockNavigate);
        renderComponent();

        await act(async () => {
            fireEvent.click(screen.getByText('Home'));
        });

        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
});

