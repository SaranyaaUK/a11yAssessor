/**
 * 
 *  manualEvaluation.api.test.js
 * 
 *  Unit test for verifying manual evaluation api
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

// Dynamically import the dependencies
const db = (await import('../../../config/databaseConfig.js')).default;

// Dynamically import the api to test
const router = (await import('../../../routes/manualEvaluation.js')).default;

// Create the express app
const app = express();
app.use(express.json());
app.use('/', router);

/**
 * 
 *  Test api/v1/manual
 * 
 */
describe('ManualEvaluation API', () => {
    // Run after each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
    * 
    *  Test POST /api/v1/manual/evalFormDetails
    * 
    */
    describe('GET /evalFormDetails', () => {

        // Positive test - Get form details
        it('should return 200 and the form details', async () => {
            // Mock data
            const mockPrinciples = [{ id: 1, name: 'Principle 1' }];
            const mockGuidelines = [{ id: 1, title: 'Guideline 1', principle_name: 'Principle 1' }];
            const mockQuestions = [{ q_id: 1, guideline_name: 'Guideline 1', title: 'Question 1' }];

            // Use the mock database to mimic query response
            db.query.mockResolvedValueOnce([{
                rows: mockPrinciples
            }, {
                rows: mockGuidelines
            }, {
                rows: mockQuestions
            }]);

            // Make the request to the endpoint
            const response = await request(app)
                .get('/evalFormDetails');

            // Verify the response
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.principles).toEqual(mockPrinciples);
            expect(response.body.groupedGuidelines).toHaveProperty('Principle 1');
            expect(response.body.groupedGuidelines['Principle 1'][0]).toHaveProperty('questions');
            expect(response.body.groupedQuestions).toHaveProperty('Guideline 1');
        });

        // Negaitve test - Handle server error
        it('should return 500 if there is a server error', async () => {
            db.query.mockRejectedValueOnce(new Error('Database error'));

            // Make the request to the endpoint
            const response = await request(app)
                .get('/evalFormDetails');

            // Verify the response
            expect(response.status).toBe(500);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Database error');
        });
    });

    /**
    * 
    *  Test POST /api/v1/manual/results
    * 
    */
    describe('POST /results', () => {

        // Positive test - Save manual results
        it('should return 200 and save the manual evaluation results', async () => {
            // Mock data
            const mockEvaluator = { evaluator_id: 1 };
            const mockResult = {
                manual_results: [{ q_id: 1, result: 'Pass', observation: 'Good' }],
                result_time: { site_id: 1, manual_time: '2024-08-16T12:00:00Z' }
            };

            // Use the mock database to mimic query response
            db.query.mockResolvedValueOnce({ rows: [mockEvaluator] });
            db.query.mockResolvedValueOnce({ rows: [mockResult] });

            // Make the request to the endpoint
            const response = await request(app)
                .post('/results')
                .send({
                    site_id: 1,
                    evalFormData: {
                        1: { resultOption: 'Pass', observation: 'Good' }
                    }
                });

            // Verify the response
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.result).toEqual(mockResult);
        });

        // Negaitve test - Handle site_id missing
        it('should return 403 if site_id is not provided', async () => {
            // Make the request to the endpoint
            const response = await request(app)
                .post('/results')
                .send({
                    evalFormData: {
                        1: { resultOption: 'Pass', observation: 'Good' }
                    }
                });

            // Verify the response
            expect(response.status).toBe(403);
            expect(JSON.parse(response.text)).toBe("Site ID is required to add the information");
        });

        // Negaitve test - Handle server error
        it('should return 500 if there is a server error', async () => {
            // Use the mock database to mimic query response
            db.query.mockRejectedValueOnce(new Error('Database error'));

            // Make the request to the endpoint
            const response = await request(app)
                .post('/results')
                .send({
                    site_id: 1,
                    evalFormData: {
                        1: { resultOption: 'Pass', observation: 'Good' }
                    }
                });

            // Verify the response
            expect(response.status).toBe(500);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Database error');
        });
    });

    /**
    * 
    *  Test POST /api/v1/manual/results/:siteid
    * 
    */
    describe('GET /results/:siteid', () => {
        // Positive test - Get results by site id
        it('should return 200 and the grouped manual results', async () => {
            // Mock data
            const mockResults = [
                {
                    q_id: 1,
                    guideline_name: 'Guideline 1',
                    title: 'Question 1',
                    observation: 'Good',
                    result: 'Pass',
                    principle_name: 'Principle 1'
                }
            ];

            // Use the mock database to mimic query response
            db.query.mockResolvedValueOnce({ rows: mockResults });

            // Make the request to the endpoint
            const response = await request(app)
                .get('/results/1');

            // Verify the response
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.result).toHaveProperty('Principle 1');
            expect(response.body.result['Principle 1']).toHaveProperty('Guideline 1');
            expect(response.body.result['Principle 1']['Guideline 1'][0].title).toBe('Question 1');
        });

        // Negative test - Handle site does not exit
        it('Handle the site does not exist case', async () => {
            // Use the mock database to mimic query response
            db.query.mockResolvedValueOnce({ rows: [] });

            // Make the request to the endpoint
            const response = await request(app)
                .get('/results/999');

            // Verify the response
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Site does not exit');
        });

        // Negaitve test - Handle server error
        it('should return 500 if there is a server error', async () => {
            // Use the mock database to mimic query response
            db.query.mockRejectedValueOnce(new Error('Database error'));

            // Make the request to the endpoint
            const response = await request(app)
                .get('/results/1');

            // Verify the response
            expect(response.status).toBe(500);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Database error');
        });
    });
});
