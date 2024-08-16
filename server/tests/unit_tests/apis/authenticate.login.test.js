/**
 * 
 *  authenticate.login.test.js
 * 
 *  Unit test for verifying the user login api
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

// Mock the passport middleware
jest.mock('passport', () => {
    return {
        __esModule: true,
        authenticate: jest.fn(() => (req, res, next) => {
            req.user = { email: 'test@example.com' }; // Mock authenticated user
            next();
        }),
        use: jest.fn(),
        serializeUser: jest.fn(),
        deserializeUser: jest.fn(),
    }
});

// Dynamically import the dependencies.
const db = (await import('../../../config/databaseConfig.js')).default;
const generateJWT = (await import("../../../utils/generateJWT.js")).default;

// Dynamically import the api to test
const router = (await import('../../../routes/authentication.js')).default;

// Create the express app
const app = express();
app.use(express.json());
app.use('/', router);


/**
 *   Test the POST /api/v1/auth/login
 */
describe('POST /login', () => {

    // Run this before each test point
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Positive case - return JWT if login is successful
    it('should return a token if login is successful', async () => {
        const token = 'mockedToken';

        // Mock database response
        db.query.mockResolvedValueOnce({ rows: [{ user_id: 1, verified: true }] });

        // Mock JWT generation
        generateJWT.mockReturnValue(token);

        // Make the request to the endpoint
        const response = await request(app)
            .post('/login')
            .send();

        // Verify the response
        expect(response.status).toBe(200);
        expect(response.body.token).toBe(token);
    });

    // Negative case - If user is not verified do not log them in
    it('should return 401 if email is not verified', async () => {
        const token = 'mockedToken';

        // Mock database response
        db.query.mockResolvedValueOnce({ rows: [{ verified: false }] });

        // Mock JWT generation
        generateJWT.mockReturnValue(token);

        // Make the request to the endpoint
        const response = await request(app)
            .post('/login')
            .send();

        // Verify the response
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Email not verified yet, please verify your email before logging in!');
    });

    // Negative case - Server errors handled smoothly
    it('should handle server errors gracefully', async () => {

        // Mock database to throw an error
        db.query.mockRejectedValueOnce(new Error('Database error'));

        // Make the request to the endpoint
        const response = await request(app)
            .post('/login')
            .send();

        // Verify the response
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Server Error');
    });
});