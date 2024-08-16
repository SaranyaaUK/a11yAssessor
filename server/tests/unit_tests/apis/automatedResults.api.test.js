/**
 * 
 *  automatedResults.api.test.js
 * 
 *  Unit test for verifying automated results api
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
    const mClient = {
        connect: jest.fn(),
        query: jest.fn(),
        end: jest.fn(),
    };
    return {
        __esModule: true,
        default: mClient,
    };
});

// Mock the getPa11yResult
jest.unstable_mockModule('../../../utils/getPa11yResult.js', () => {
    return {
        __esModule: true,
        default: jest.fn(),
    };
});

// Mock authenticated user
let mockUser = {
    user_id: 1,
    first_name: 'John',
    last_name: 'Doe'
};

// Mock user authentication middleware
const mockAuthMiddleware = (req, res, next) => {
    req.user = mockUser;
    next();
};

// Dynamically import the dependencies
const db = (await import('../../../config/databaseConfig.js')).default;
const getPa11yResult = (await import('../../../utils/getPa11yResult.js')).default;

// Dynamically import the api to test
const router = (await import('../../../routes/automatedResults.js')).default;

// Create the express app
const app = express();
app.use(express.json());
app.use(mockAuthMiddleware);
app.use('/', router);


/**
 * 
 *  Test api/v1/automated
 * 
 */
describe('AutomatedResults API', () => {
    // Run after each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
    * 
    *  Test POST /api/v1/automated/results
    * 
    */
    describe('POST /results', () => {

        // Positive test - Save automated results
        it('should return 200 and save the result successfully', async () => {
            // Use the mock getPa11yResult
            const pa11yMockResult = { issues: [] };
            getPa11yResult.mockResolvedValue(pa11yMockResult);

            // Use the mock database to mimic query response
            db.query.mockResolvedValueOnce({
                rows: [{
                    automated_result: {
                        evaluator_id: 1,
                        result: pa11yMockResult
                    },
                    result_time: {
                        site_id: 1,
                        auto_time: '2024-08-16T12:00:00Z'
                    }
                }]
            });

            // Make the request to the endpoint
            const response = await request(app)
                .post('/results')
                .send({
                    site_id: 1,
                    url: 'http://example.com'
                });

            // Verify the response
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.result.automated_result.result).toEqual(pa11yMockResult);
            expect(getPa11yResult).toHaveBeenCalledWith('http://example.com', {
                includeNotices: true,
                includeWarnings: true,
                runners: ["axe"]
            });
        });

        // Negaitve test - User not authenticated
        it('should return 403 if the user is not authenticated', async () => {
            // Set mock user
            mockUser = null;

            // Make the request to the endpoint
            const response = await request(app)
                .post('/results')
                .send({
                    site_id: 1,
                    url: 'http://example.com'
                });

            // Verify the response
            expect(response.status).toBe(403);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('User session expired login and try again');
        });

        // Negaitve test - Handle server error
        it('should return 500 if there is a server error', async () => {
            // Set mock user
            mockUser = {
                user_id: 1,
                first_name: 'John',
                last_name: 'Doe'
            };

            getPa11yResult.mockRejectedValueOnce(new Error('Pa11y error'));

            // Make the request to the endpoint
            const response = await request(app)
                .post('/results')
                .send({
                    site_id: 1,
                    url: 'http://example.com'
                });

            // Verify the response
            expect(response.status).toBe(500);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Server Error');
        });
    });

    /**
    * 
    *  Test POST /api/v1/automated//results/:siteid
    * 
    */
    describe('GET /results/:siteid', () => {
        // Positive case - Get the result by site id
        it('should return 200 and the automated result if it exists', async () => {
            // Use mock database to return query result
            db.query.mockResolvedValueOnce({
                rows: [{
                    result: { issues: [] }
                }]
            });

            // Make the request to the endpoint
            const response = await request(app)
                .get('/results/1');

            // Verify the response
            expect(response.status).toBe(200);
            expect(response.body.result).toEqual({ issues: [] });
            expect(response.body.message).toBe('Result received');
        });

        // Negative case - Return message if the site queried does not exist
        it('Handle if the site does not exist', async () => {
            // Use mock database to return query result
            db.query.mockResolvedValueOnce({
                rows: []
            });

            // Make the request to the endpoint
            const response = await request(app)
                .get('/results/999');

            // Verify the response
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Site does not exit');
        });

        // Negative case - Handle server error
        it('should return 500 if there is a server error', async () => {
            // Use mock database to return query result
            db.query.mockRejectedValueOnce(new Error('Database error'));

            // Make the request to the endpoint
            const response = await request(app)
                .get('/results/1');

            // Verify the response
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Server Error');
        });

        // Negative case - Handle unauthorised user
        it('should return 403 if the user is not authenticated', async () => {
            // Set mock user (unathenticated)
            mockUser = null;

            // Make the request to the endpoint
            const response = await request(app)
                .get('/results/1');

            // Verify the response
            expect(response.status).toBe(403);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('User session expired login and try again');
        });
    });
});
