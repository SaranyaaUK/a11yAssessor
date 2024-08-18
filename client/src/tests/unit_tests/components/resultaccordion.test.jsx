/**
 * 
 * resultaccordion.test.jsx
 * 
 * Tests the result page accordion component
 * 
*/
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ServerAPI from '../../../apis/ServerAPI';
// Component under test
import ResultAccordion from '../../../components/ResultAccordion';

/**
 *  Mock modules
 */

// Mock the server api
jest.mock('../../../apis/ServerAPI', () => ({
    get: jest.fn(),
}));

//  Test the result page accordion component
describe('ResultAccordion Component', () => {
    // Mock results
    const mockGroupedResults = {
        warnings: [
            {
                typeCode: 1,
                runnerExtras: { help: 'This is a warning', helpUrl: 'http://example.com/help' },
                context: '<div>Warning context</div>',
                selector: '#warning',
            },
        ],
        errors: [
            {
                typeCode: 2,
                runnerExtras: { help: 'This is an error', helpUrl: 'http://example.com/error' },
                context: '<div>Error context</div>',
                selector: '#error',
            },
        ],
    };

    const renderComponent = () => render(<ResultAccordion url="http://example.com" groupedResults={mockGroupedResults} />);
    // Check the component rendering
    it('renders the component with grouped results', () => {
        renderComponent();

        expect(screen.getByText('WARNINGS')).toBeInTheDocument();
        expect(screen.getByText('ERRORS')).toBeInTheDocument();
        expect(screen.getByText('This is a warning')).toBeInTheDocument();
        expect(screen.getByText('This is an error')).toBeInTheDocument();
        expect(screen.getAllByText('View Snapshot')).toHaveLength(2);
    });

    // Check the screenshot model dialog rendering
    it('opens the modal and fetches image when "View Snapshot" is clicked', async () => {
        const mockImage = 'mockBase64ImageData';
        ServerAPI.get.mockResolvedValueOnce({ data: mockImage });

        renderComponent();

        await act(async () => {
            fireEvent.click(screen.getAllByText('View Snapshot')[0]);
        });

        await waitFor(() => expect(ServerAPI.get).toHaveBeenCalledWith('/getDOMElementImage', {
            params: {
                css: '#warning',
                url: 'http://example.com',
                element: true,
            }
        }));

        expect(screen.getByText('Element Screenshot')).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByRole('img')).toHaveAttribute('src', `data:image/jpeg;base64,${mockImage}`);
        });
    });

    // Check the modal dialog close behaviour
    it('closes the modal when close button is clicked', async () => {
        const mockImage = 'mockBase64ImageData';
        ServerAPI.get.mockResolvedValueOnce({ data: mockImage });

        renderComponent();

        await act(async () => {
            fireEvent.click(screen.getAllByText('View Snapshot')[0]);
        });

        await waitFor(() => expect(screen.getByText('Element Screenshot')).toBeInTheDocument());

        await act(async () => {
            fireEvent.click(screen.getByText('Close'));
        });

        await waitFor(() => expect(screen.queryByText('Element Screenshot')).not.toBeInTheDocument());
    });
});

