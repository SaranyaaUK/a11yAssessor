/**
 * 
 *  sites.api.test.js
 * 
 *  Unit test for verifying sites api
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

// Dynamically import the api to test
const router = (await import('../../../routes/sites.js')).default;

// Create the express app
const app = express();
app.use(express.json());
app.use(mockAuthMiddleware);
app.use('/', router);

/**
 * 
 *  Test api/v1/site
 * 
 */
describe('Sites API', () => {
    // Run before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
    * 
    *  Test POST /api/v1/site
    * 
    */
    describe('POST /', () => {
        // Positive test - Add a site
        it('should add a site and return 200 on success', async () => {
            // Use the mock database to mimic query response
            db.query.mockResolvedValueOnce({
                rows: [{ site_id: 1, name: 'Example Site', url: 'http%3A%2F%2Fexample.com' }]
            });
            db.query.mockResolvedValueOnce({ rows: [{ site_id: 1 }] });
            db.query.mockResolvedValueOnce({ rows: [{ site_id: 1 }] });
            db.query.mockResolvedValueOnce({ rows: [{ site_id: 1, user_id: 1 }] });

            // Make the request to the endpoint
            const response = await request(app)
                .post('/')
                .send({
                    name: 'Example Site',
                    url: 'http://example.com'
                });

            // Verify the response
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Site Added');
            expect(response.body.site.name).toBe('Example Site');
        });

        // Negaitve test - Handle server error
        it('should return 500 if there is a server error', async () => {
            // Use the mock database to mimic query response
            db.query.mockRejectedValueOnce(new Error('Database error'));

            // Make the request to the endpoint
            const response = await request(app)
                .post('/')
                .send({
                    name: 'Example Site',
                    url: 'http://example.com'
                });

            // Verify the response
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Server Error');
        });

        // Negaitve test - User not authenticated
        it('should return 403 if user is not authenticated', async () => {
            // Set mock user
            mockUser = null;

            // Make the request to the endpoint
            const response = await request(app)
                .post('/')
                .send({
                    name: 'Example Site',
                    url: 'http://example.com'
                });

            // Verify the response
            expect(response.status).toBe(403);
            expect(response.body.message).toBe('User session expired login and try again');
        });
    });

    /**
    * 
    *  Test GET /api/v1/site
    * 
    */
    describe('GET /', () => {
        // Positive test - Get all sites
        it('should return all sites for the authenticated user', async () => {
            // Mock user
            mockUser = {
                user_id: 1,
                first_name: 'John',
                last_name: 'Doe'
            };

            // Use the mock database to mimic query response
            db.query.mockResolvedValueOnce({
                rows: [{ site_id: 1, name: 'Example Site', url: 'http://example.com' }]
            });

            // Make the request to the endpoint
            const response = await request(app).get('/');

            // Verify the response
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.sites.length).toBe(1);
            expect(response.body.sites[0].name).toBe('Example Site');
        });

        // Negaitve test - Handle server error
        it('should return 500 if there is a server error', async () => {
            // Use the mock database to mimic query response
            db.query.mockRejectedValueOnce(new Error('Database error'));

            // Make the request to the endpoint
            const response = await request(app).get('/');

            // Verify the response
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Server Error');
        });

        // Negaitve test - User not authenticated
        it('should return 403 if user is not authenticated', async () => {
            // Set mock user
            mockUser = null;

            // Make the request to the endpoint
            const response = await request(app).get('/');

            // Verify the response
            expect(response.status).toBe(403);
            expect(response.body.message).toBe('User session expired login and try again');
        });

    });

    /**
    * 
    *  Test GET /api/v1/site/:id
    * 
    */
    describe('GET /:id', () => {
        // Positive test - Get site info by site id
        it('should return site details by ID', async () => {
            // Mock user
            mockUser = {
                user_id: 1,
                first_name: 'John',
                last_name: 'Doe'
            };

            // Use the mock database to mimic query response
            db.query.mockResolvedValueOnce({
                rows: [{
                    site_id: 1,
                    name: 'Example Site',
                    url: 'http://example.com',
                    auto_time: '2024-01-01T00:00:00Z',
                    manual_time: '2024-01-01T00:00:00Z'
                }]
            });

            // Make the request to the endpoint
            const response = await request(app).get('/1');

            // Verify the response
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.site.name).toBe('Example Site');
            expect(response.body.timeStamp.auto_time).toBe('2024-01-01T00:00:00Z');
        });

        // Negaitve test - Handle server error
        it('should return 500 if there is a server error', async () => {
            // Use the mock database to mimic query response
            db.query.mockRejectedValueOnce(new Error('Database error'));

            // Make the request to the endpoint
            const response = await request(app).get('/1');

            // Verify the response
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Server Error');
        });

        // Negaitve test - User not authenticated
        it('should return 403 if user is not authenticated', async () => {
            // Mock user
            mockUser = null;

            // Make the request to the endpoint
            const response = await request(app).get('/1');

            // Verify the response
            expect(response.status).toBe(403);
            expect(response.body.message).toBe('User session expired login and try again');
        });
    });

    /**
    * 
    *  Test DELETE /api/v1/site/:id
    * 
    */
    describe('DELETE /:id', () => {
        // Negaitve test - Handle server error
        it('should return 403 if user is not authenticated', async () => {
            // Mock user
            mockUser = null;

            // Make the request to the endpoint
            const response = await request(app).delete('/1');

            // Verify the response
            expect(response.status).toBe(403);
            expect(response.body.message).toBe('User session expired login and try again');
        });

        // Positive case - Delete site by site id
        it('should delete a site and return 200 on success', async () => {
            // Mock user
            mockUser = {
                user_id: 1,
                first_name: 'John',
                last_name: 'Doe'
            };

            // Use the mock database to mimic query response
            db.query.mockResolvedValueOnce({});

            // Make the request to the endpoint
            const response = await request(app).delete('/1');

            // Verify the response
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Site Deleted');
        });

        // Negaitve test - Handle server error
        it('should return 500 if there is a server error', async () => {
            db.query.mockRejectedValueOnce(new Error('Database error'));

            // Make the request to the endpoint
            const response = await request(app).delete('/1');

            // Verify the response
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Server Error');
        });
    });
});
