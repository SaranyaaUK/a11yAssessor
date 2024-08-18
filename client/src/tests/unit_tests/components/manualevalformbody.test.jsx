/**
 * 
 * manualevaluationformbody.test.jsx
 * 
 * Tests the manual evalution form body
 * 
*/
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AppContext } from '../../../context/AppContext';
// Component under test
import ManualEvalFormBody from '../../../components/ManualEvalFormBody';

// Test the body content of the manual evaluation form
describe('ManualEvalFormBody Component', () => {
    // Mock data
    const formContent = [
        {
            principle_name: 'Principle 1',
            title: 'Guideline 1.1',
            questions: [
                {
                    q_id: 'q1',
                    title: 'Question 1',
                    q_text: 'Does the page have a title?',
                    instructions: ['Instruction 1', 'Instruction 2'],
                },
            ],
            moreinfo: ['https://example.com/moreinfo'],
            benefits: ['Benefit 1', 'Benefit 2'],
        },
    ];

    const principles = [
        {
            title: 'Principle 1',
            description: 'This is the description for Principle 1',
        },
    ];

    const evalFormData = {
        q1: {
            resultOption: 'Not Evaluated',
            observation: '',
        },
    };

    const setEvalFormData = jest.fn();

    const renderComponent = () =>
        render(
            <AppContext.Provider value={{ evalFormData, setEvalFormData }}>
                <ManualEvalFormBody formContent={formContent} principles={principles} />
            </AppContext.Provider>
        );

    // Test the component rendering
    test('renders principle name and description', () => {
        renderComponent();

        expect(screen.getByText('Principle 1')).toBeInTheDocument();
        expect(screen.getByText('This is the description for Principle 1')).toBeInTheDocument();
    });

    test('renders guideline title and question', () => {
        renderComponent();

        expect(screen.getByText('Guideline 1.1')).toBeInTheDocument();
        expect(screen.getByText('Question 1')).toBeInTheDocument();
        expect(screen.getByText('Does the page have a title?')).toBeInTheDocument();
    });

    test('renders instructions, more info, and benefits', () => {
        renderComponent();

        expect(screen.getByText('Instruction 1')).toBeInTheDocument();
        expect(screen.getByText('Instruction 2')).toBeInTheDocument();

        expect(screen.getByText('More Info')).toBeInTheDocument();
        expect(screen.getByText('https://example.com/moreinfo')).toBeInTheDocument();

        expect(screen.getByText('Benefits')).toBeInTheDocument();
        expect(screen.getByText('Benefit 1')).toBeInTheDocument();
        expect(screen.getByText('Benefit 2')).toBeInTheDocument();
    });

    // Test the component input changes
    test('handles form input changes', () => {
        renderComponent();

        const resultSelect = screen.getByRole('combobox');
        const observationTextarea = screen.getByPlaceholderText('Enter your observation');

        // Simulate changing the result select input
        fireEvent.change(resultSelect, { target: { value: 'Pass' } });
        expect(setEvalFormData).toHaveBeenCalledWith({
            ...evalFormData,
            q1: {
                ...evalFormData.q1,
                resultOption: 'Pass',
            },
        });

        // Simulate changing the observation textarea
        fireEvent.change(observationTextarea, { target: { value: 'This is an observation' } });
        expect(setEvalFormData).toHaveBeenCalledWith({
            ...evalFormData,
            q1: {
                ...evalFormData.q1,
                observation: 'This is an observation',
            },
        });
    });

    test('renders "No Questions" if no questions are provided', () => {
        const formContentWithoutQuestions = [
            {
                principle_name: 'Principle 1',
                title: 'Guideline 1.1',
                moreinfo: [],
                benefits: [],
            },
        ];

        render(
            <AppContext.Provider value={{ evalFormData, setEvalFormData }}>
                <ManualEvalFormBody formContent={formContentWithoutQuestions} principles={principles} />
            </AppContext.Provider>
        );

        expect(screen.getByText('No Questions')).toBeInTheDocument();
    });
});
