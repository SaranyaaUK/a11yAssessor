/**
 * 
 *  authenticate.verify.test.js
 * 
 *  Unit test for verifying the user (authorisation)
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

// Mock the passport middleware
jest.mock('passport', () => {
    return {
        __esModule: true,
        authenticate: jest.fn((strategy, options, callback) => (req, res, next) => {
            if (req.headers['token']) {
                req.user = {
                    first_name: 'John',
                    last_name: 'Doe',
                    user_id: 1
                }; // Mock authenticated user
            } else {
                req.user = null;
            }
            next();
        }),
        use: jest.fn(),
        serializeUser: jest.fn(),
        deserializeUser: jest.fn(),
    }
});

// Dynamically import the api to test
const router = (await import('../../../routes/authentication.js')).default;

// Create the express app
const app = express();
app.use(express.json());
app.use('/', router);

/**
 *   Test the GET /api/v1/auth/verify
 */
describe('GET /verify', () => {

    // Run this before each test point
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Positive case - return user info once authorised
    it('should return user data if authenticated', async () => {
        // Make the request to the endpoint
        const response = await request(app)
            .get('/verify')
            .set('token', 'mockToken')
            .send();

        // Verify the response
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.user).toEqual({
            first_name: 'John',
            last_name: 'Doe',
            user_id: 1
        });
    });

    // Negative case - Handle case where user is unauthorised
    it('should return 401 if not authenticated', async () => {
        // Make the request to the endpoint
        const response = await request(app)
            .get('/verify')
            .send(); // No authorization header

        // Verify the response
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Session expired, login again to continue');
    });
});