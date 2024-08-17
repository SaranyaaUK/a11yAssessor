/**
 * 
 * home.test.jsx
 * 
 * Tests the home page content
 * 
*/
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom"
import { toast } from "react-toastify";
// Component under test
import HomePageBody from "../../../components/HomePageBody";


/**
 *  Mock modules
 */
// Mock the react-router-dom
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => jest.fn(),
}));

// Mock the toast method
jest.mock("react-toastify", () => ({
    toast: {
        error: jest.fn(),
    },
}));

// Test the home page body section
describe("HomePageBody", () => {
    // Render the component
    const setup = () => {
        render(<HomePageBody />);
    };

    // Check if the required elements are present
    test("renders correctly", () => {
        setup();

        // Check if the input field and buttons are rendered
        expect(screen.getByPlaceholderText("https://www.example.com")).toBeInTheDocument();
        expect(screen.getByText("Enter the URL")).toBeInTheDocument();
        expect(screen.getByText("Evaluate")).toBeInTheDocument();
    });

    // Check if the user input is acquired properly
    test("handles user input", () => {
        setup();

        const urlInput = screen.getByPlaceholderText("https://www.example.com");

        // Simulate user typing in the input field
        fireEvent.change(urlInput, { target: { value: "https://www.test.com" } });

        expect(urlInput.value).toBe("https://www.test.com");
    });

    // Check error handling for invalid URL
    test("displays error toast if URL is invalid", () => {
        setup();

        const evaluateButton = screen.getByText("Evaluate");

        // Click the evaluate button without entering a valid URL
        fireEvent.click(evaluateButton);

        expect(toast.error).toHaveBeenCalledWith(
            "Enter a valid URL, in the form as shown in the URL input field",
            { position: "top-center" }
        );
    });

    // Check if the evaluate button triggers the result page opening
    test("navigates to the correct path on valid URL input", () => {
        const mockNavigate = jest.fn();

        jest.spyOn(require("react-router-dom"), "useNavigate").mockImplementation(() => mockNavigate);

        setup();

        const urlInput = screen.getByPlaceholderText("https://www.example.com");
        const evaluateButton = screen.getByText("Evaluate");

        // Enter a valid URL
        fireEvent.change(urlInput, { target: { value: "https://www.test.com" } });

        // Click the evaluate button
        fireEvent.click(evaluateButton);

        // Check if navigate was called with the correct path
        expect(mockNavigate).toHaveBeenCalledWith("/https%3A%2F%2Fwww.test.com");
    });
});
