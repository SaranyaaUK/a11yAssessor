/**
 * 
 *  authenticate.emailVerify.test.js
 * 
 *  Unit test for verifying the email verification api
 * 
 */

import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';


/**
 * 
 *  Mocks
 *  Mock all dependent module using jest
 *  mockModule 
 * 
 */

// Mock the Database
jest.unstable_mockModule('../../../config/databaseConfig.js', () => {
    const Pool = {
        connect: jest.fn(),
        query: jest.fn(),
        end: jest.fn(),
    };
    return {
        __esModule: true,
        default: Pool,
    };
});

// Mock the JSON Web token generation
jest.mock('jsonwebtoken', () => {
    return {
        __esModule: true,
        verify: jest.fn(),
    }
});

// Dynamically import the dependencies.
const db = (await import('../../../config/databaseConfig.js')).default;
const jwt = (await import("jsonwebtoken")).default;


// Dynamically import the api to test
const router = (await import('../../../routes/authentication.js')).default;

// Create the express app
const app = express();
app.use(express.json());
app.use('/', router);


/**
 *   Test the GET /api/v1/auth/activate/:id/:token
 */
describe('GET /activate/:id/:token', () => {

    // Run this before each test point
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Positive case - Should not verfiy user if user does not exist
    it('should return error if user does not exist', async () => {
        const id = '123';
        const token = 'validToken';

        // Mock the database response
        db.query.mockResolvedValueOnce({ rows: [{ user_id: '2' }] });

        // Mock the jwt.verify to return a valid user id
        jwt.verify.mockReturnValue({ user: { id } });

        // Make the request to the endpoint
        const response = await request(app)
            .get(`/activate/${id}/${token}`)
            .send();

        // Verify the response
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Email verification failed, invalid link');
    });

    // Positive case - Verify user if token is valid
    it('should return 200 and verify the email if token and user are valid', async () => {
        const id = '123';
        const token = 'validToken';

        // Mock the database response to return a user
        db.query.mockResolvedValueOnce({ rows: [{ user_id: id }] });

        // Mock the jwt.verify to return a valid user id
        jwt.verify.mockReturnValue({ user: { id } });

        // Mock the database query for updating user status
        db.query.mockResolvedValueOnce({ rows: [{ user_id: id, verified: true }] });

        // Make the request to the endpoint
        const response = await request(app)
            .get(`/activate/${id}/${token}`)
            .send();

        // Verify the response
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Email verification successful');
    });

    // Negative case - Should not verfiy user if token is invalid
    it('should return error if token is invalid', async () => {
        const id = '123';
        const token = 'invalidToken';

        db.query
            .mockResolvedValueOnce({ rows: [{ user_id: '123', first_name: 'John', last_name: 'Doe' }] });
        // Mock the jwt.verify to throw an error
        jwt.verify.mockImplementation(() => { throw new Error('Invalid token'); });

        // Make the request to the endpoint
        const response = await request(app)
            .get(`/activate/${id}/${token}`);

        // Verify the response
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Server Error');
    });


    // Negative case - Verify server errors are handled smoothly
    it('should handle server errors gracefully', async () => {
        const id = '123';
        const token = 'validToken';

        // Mock the database to throw an error
        db.query.mockRejectedValueOnce(new Error('Database error'));

        // Mock the jwt.verify to return a valid user id
        jwt.verify.mockReturnValue({ user: { id } });

        // Make the request to the endpoint
        const response = await request(app)
            .get(`/activate/${id}/${token}`)
            .send();

        // Verify the response
        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Server Error');
    });
});