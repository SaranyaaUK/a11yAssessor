/**
 * 
 *  authenticate.register.test.js
 * 
 *  Unit test for verifying the registration api
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
jest.unstable_mockModule("../../../utils/generateJWT.js", () => {
    return {
        __esModule: true,
        default: jest.fn()
    }
});

// Mock the node-mailer (email sending package)
jest.unstable_mockModule("../../../utils/sendEmail.js", () => {
    return {
        __esModule: true,
        default: jest.fn()
    }
});

// Dynamically import the dependencies.
const db = (await import('../../../config/databaseConfig.js')).default;
const generateJWT = (await import("../../../utils/generateJWT.js")).default;
const sendEmail = (await import("../../../utils/sendEmail.js")).default;

// Dynamically import the api to test
const router = (await import('../../../routes/authentication.js')).default;

// Create the express app
const app = express();
app.use(express.json());
app.use('/', router);


/**
 *   Test the GET /api/v1/auth/register
 */
describe('POST /register', () => {

    // Run this before each test point
    beforeEach(async () => {
        jest.clearAllMocks();
    });

    // Negative case - Test if invalid email is given
    it('should return 401 if email is invalid', async () => {
        // Make the request to the endpoint
        const response = await request(app)
            .post('/register')
            .send({
                firstname: 'John',
                lastname: 'Doe',
                email: 'invalid-email',
                password: 'password',
                confirmPassword: 'password'
            });

        // Verify the response
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid email');
    });

    // Negative case - Test for existing user 
    it('should return 401 if user already exists', async () => {
        // Use the mock database - Mimic user existence
        db.query.mockResolvedValueOnce({ rows: [{ email: 'existing@example.com' }] });

        // Make the request to the endpoint
        const response = await request(app)
            .post('/register')
            .send({
                firstname: 'John',
                lastname: 'Doe',
                email: 'existing@example.com',
                password: 'password',
                confirmPassword: 'password'
            });

        // Verify the response
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('User already exist!');
    });

    // Negative case: Test for password mimatch
    it('should return 401 if passwords do not match', async () => {
        // Use the mock database - Mimic user not existing
        db.query.mockResolvedValueOnce({ rows: [] });

        // Make the request to the endpoint
        const response = await request(app)
            .post('/register')
            .send({
                firstname: 'John',
                lastname: 'Doe',
                email: 'new@example.com',
                password: 'password123',
                confirmPassword: 'password'
            });

        // Verify the response
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Password Mismatch!');
    });

    // Positive case - Test user registration
    it('should register a new user successfully', async () => {
        // Use the mock database
        // Mimics user not existing as well as user added successfully
        db.query
            .mockResolvedValueOnce({ rows: [] })
            .mockResolvedValueOnce({ rows: [{ user_id: 1, first_name: 'John', last_name: 'Doe' }] });

        // Use mock JWT
        generateJWT.mockReturnValue('mockedToken');
        // Use mock email sender
        sendEmail.mockResolvedValue(true);

        // Make the request to the endpoint
        const response = await request(app)
            .post('/register')
            .send({
                firstname: 'John',
                lastname: 'Doe',
                email: 'new@example.com',
                password: 'password',
                confirmPassword: 'password'
            });

        // Verify the response
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Registration successful, please verify your email before login');
        expect(response.body.token).toBe('mockedToken');
    });

    // Negative case - Test server issue handling
    it('should handle server errors gracefully', async () => {
        // Use the mock database
        db.query.mockRejectedValueOnce(new Error('Database error'));

        // Make the request to the endpoint
        const response = await request(app)
            .post('/register')
            .send({
                firstname: 'John',
                lastname: 'Doe',
                email: 'new@example.com',
                password: 'password',
                confirmPassword: 'password'
            });

        // Verify the response
        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Server Error');
    });
});