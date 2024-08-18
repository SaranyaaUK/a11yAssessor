/**
 * 
 * siteevaluation.test.jsx
 * 
 * Tests the site evaluation card
 * 
*/
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
// Component under test
import SiteEvaluationCard from '../../../components/SiteEvaluationCard';


//  Test the site evaluation card
describe('SiteEvaluationCard Component', () => {
    const mockEvalBtnClick = jest.fn();
    const mockResultBtnClick = jest.fn();

    const defaultProps = {
        cardHeader: 'Automated Evaluation',
        isButtonDisabled: false,
        timeStamp: '2024-01-01T10:00:00Z',
        site: { site_id: 1, url: 'http://testsite.com' },
        isResultloading: false,
        iconClass: 'fa-solid fa-cogs',
        evalBtnClick: mockEvalBtnClick,
        resultBtnClick: mockResultBtnClick,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Check the evaluation card rendering
    test('renders the component with given props', () => {
        render(<SiteEvaluationCard {...defaultProps} />);

        expect(screen.getByText('Automated Evaluation')).toBeInTheDocument();
        expect(screen.getByText('Re-Evaluate')).toBeInTheDocument();
        expect(screen.getByText('Result')).toBeInTheDocument();
        expect(screen.getByText('Last Evaluation')).toBeInTheDocument();
        expect(screen.getByText('1/1/2024')).toBeInTheDocument();
    });

    // Check if the evaluate button rendering
    test('displays Evaluate button when isButtonDisabled is true', () => {
        render(<SiteEvaluationCard {...defaultProps} isButtonDisabled={true} />);

        expect(screen.getByText('Evaluate')).toBeInTheDocument();
        expect(screen.queryByText('Re-Evaluate')).not.toBeInTheDocument();
    });

    // Check if the re-evaluate button rendering
    test('calls evalBtnClick with correct arguments when Evaluate/Re-Evaluate button is clicked', () => {
        render(<SiteEvaluationCard {...defaultProps} />);

        fireEvent.click(screen.getByText('Re-Evaluate'));

        expect(mockEvalBtnClick).toHaveBeenCalledWith(1, 'http://testsite.com');
    });

    // Check the result button callback trigger
    test('calls resultBtnClick when Result button is clicked', () => {
        render(<SiteEvaluationCard {...defaultProps} />);

        fireEvent.click(screen.getByText('Result'));

        expect(mockResultBtnClick).toHaveBeenCalled();
    });

    // Check the result button rendering
    test('disables Result button when isButtonDisabled is true', () => {
        render(<SiteEvaluationCard {...defaultProps} isButtonDisabled={true} />);

        const resultButton = screen.getByText('Result').closest('button');
        expect(resultButton).toBeDisabled();
    });

    // Check the last-evlaution
    test('displays Not Evaluated when isButtonDisabled is true', () => {
        render(<SiteEvaluationCard {...defaultProps} isButtonDisabled={true} />);

        expect(screen.getByText('Not Evaluated')).toBeInTheDocument();
        expect(screen.queryByText('01/01/2024')).not.toBeInTheDocument();
    });
});
