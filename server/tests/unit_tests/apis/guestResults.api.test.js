/**
 * 
 *  guestResults.api.test.js
 * 
 *  Unit test for verifying the guest user (unauthorised routes)
 * 
 */

import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

/**
 * 
 *  Mocks
 *  Capture-Website (3p) and getPa11yResult (Utils)
 *  mocked using jest mockModule
 * 
 */
jest.unstable_mockModule('capture-website', () => {
    const funcs = {
        base64: jest.fn(),
    }
    return {
        __esModule: true,
        default: funcs,
    };
});


// Mock the getPa11yResult module
jest.unstable_mockModule('../../../utils/getPa11yResult.js', () => {
    return {
        __esModule: true,
        default: jest.fn(),
    };
});

const mockResult = { issues: [] };
const mockImage = "Image";

// Dynamically import the dependencies.
const getPa11yResult = (await import('../../../utils/getPa11yResult.js')).default;
const captureWebsite = (await import("capture-website")).default;

// Dynamically import the api to test
const router = (await import('../../../routes/guestResults.js')).default;

// Setup the app
const app = express();
app.use(express.json());
app.use('/', router);

/**
 *   Test the GET /api/v1/getDOMElementImage
 */
describe('GET /getDOMElementImage', () => {

    // Positive case - check if the expected result is returned
    it('should return a base64 image', async () => {
        // Use the mocked base64 method to return a specific base64 string
        captureWebsite.base64.mockResolvedValue(mockImage);

        // Make the request to the endpoint
        const response = await request(app)
            .get('/getDOMElementImage')
            .query({ url: encodeURIComponent('https://example.com'), css: '#element' });

        // Check the response
        expect(captureWebsite.base64).toHaveBeenCalledWith('https://example.com', expect.any(Object));
        expect(response.status).toBe(200);
        expect(response.body).toBe(mockImage);

    });

    // Positive case - API should accept dimensions 
    it('should return a base64 image given the dimensions', async () => {
        // Use the mocked base64 method to return a specific base64 string
        captureWebsite.base64.mockResolvedValue(mockImage);

        // Make the request to the endpoint
        const response = await request(app)
            .get('/getDOMElementImage')
            .query({ url: encodeURIComponent('https://example.com'), width: '1920', height: '1080' });

        // Check the response
        expect(captureWebsite.base64).toHaveBeenCalledWith('https://example.com', expect.any(Object));
        expect(response.status).toBe(200);
        expect(response.body).toBe(mockImage);
    });

    // Negative case - Check if error is handled gracefully
    it('should return 500 if there is an error capturing the image', async () => {
        // Use the mocked base64 method to return a specific base64 string
        captureWebsite.base64.mockRejectedValue(new Error('Capture failed'));

        // Make the request to the endpoint
        const response = await request(app)
            .get('/getDOMElementImage')
            .query({ url: encodeURIComponent('https://example.com'), css: '#element' });

        // Check the response
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: "Cannot capture the screenshot of the image" });
    });
});

/**
 *   Test the GET api/v1/:url
 */
describe("GET /:url", () => {
    // Positive case - 
    it("should return the pa11y result for a valid URL", async () => {
        // URL
        const url = encodeURIComponent("https://www.gla.ac.uk/");
        // Use the mocked getPa11yResult Util 
        getPa11yResult.mockResolvedValue(mockResult);

        // Make the request to the endpoint
        const response = await request(app).get(`/${url}`);

        // Verify the response
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual(mockResult);
    });
    it('should return 500 if there is an error evaluating the page', async () => {
        // URL
        const url = encodeURIComponent("https://example.com/");
        // Use the mocked getPa11yResult Util 
        getPa11yResult.mockRejectedValue(new Error('Evaluation failed'));

        // Make the request to the endpoint
        const response = await request(app)
            .get(`/${url}`);

        // Check the response
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ success: false, message: "Cannot evaluate the given page" });
    });
});