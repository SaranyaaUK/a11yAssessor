/**
 * 
 *  forgotPassword.api.test.js
 * 
 *  Unit test for verifying reset password api
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

// Mock the node-mailer (email sending)
jest.unstable_mockModule("../../../utils/sendEmail.js", () => {
    return {
        __esModule: true,
        default: jest.fn()
    }
});

// Mock the email details Utils
jest.unstable_mockModule("../../../utils/emailInfo.js", () => {
    return {
        __esModule: true,
        default: {
            passwordResetSubject: 'Reset Your Password',
            passwordResetMessage: jest.fn(),
        }
    }
});

// Mock the JSON Web token package
jest.mock('jsonwebtoken', () => {
    return {
        __esModule: true,
        verify: jest.fn(),
    }
});

// Dynamically import the dependencies.
const db = (await import('../../../config/databaseConfig.js')).default;
const generateJWT = (await import("../../../utils/generateJWT.js")).default;
const sendEmail = (await import("../../../utils/sendEmail.js")).default;
const emailInfo = (await import("../../../utils/emailInfo.js")).default;
const jwt = (await import("jsonwebtoken")).default;


// Dynamically import the api to test
const router = (await import('../../../routes/forgotPassword.js')).default;

// Create the express app
const app = express();
app.use(express.json());
app.use('/', router);

/**
 * 
 *  Test POST /api/v1/resetpassword
 * 
 */
describe('POST /', () => {

    // Run this before each test point
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Negative case - To check invalid email
    it('should return 401 for invalid email format', async () => {
        // Make the request to the endpoint
        const response = await request(app)
            .post('/')
            .send({
                email: 'invalid-email'
            });

        // Verify the response
        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Enter your registered email to proceed');
    });

    // Negative case - Not registered user trying to reset password
    it('should return 401 if email is not registered', async () => {
        // Mock the database response for non-existing email
        db.query.mockResolvedValueOnce({ rows: [] });

        // Make the request to the endpoint
        const response = await request(app)
            .post('/')
            .send({
                email: 'notregistered@example.com'
            });

        // Verify the response
        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Email is not registered with a11yAssessor check the entered email!');
    });

    // Positive case - Send reset email
    it('should send reset email and return success response', async () => {
        const user = {
            user_id: 1,
            email: 'user@example.com',
            first_name: 'John',
            last_name: 'Doe'
        };
        const token = 'mockedToken';
        const CLIENT_BASE_URL = "https://www.deploy"
        const url = `${CLIENT_BASE_URL}/resetpassword/${user.user_id}/${token}`;

        // Mock database response
        db.query.mockResolvedValueOnce({ rows: [user] });

        // Mock JWT generation
        generateJWT.mockReturnValue(token);

        // Mock email sending
        sendEmail.mockResolvedValue(true);
        emailInfo.passwordResetMessage.mockReturnValue('Reset your password here.');

        // Make the request to the endpoint
        const response = await request(app)
            .post('/')
            .send({
                email: 'user@example.com'
            });

        // Verify the response
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Password reset email sent');
        expect(response.body.token).toBe(token);
        expect(response.body.id).toBe(user.user_id);
        expect(sendEmail).toHaveBeenCalledWith(
            user.email,
            emailInfo.passwordResetSubject,
            emailInfo.passwordResetMessage(`${user.first_name} ${user.last_name}`, url)
        );
    });

    // Negative case - Handle server error
    it('should handle server errors gracefully', async () => {
        // Simulate server error in database query
        db.query.mockRejectedValueOnce(new Error('Database error'));

        // Make the request to the endpoint
        const response = await request(app)
            .post('/')
            .send({
                email: 'user@example.com'
            });

        // Verify the response
        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Server Error');
    });
});

/**
 * 
 *  Test POST /api/v1/resetpassword/:id/:token
 * 
 */
describe('POST /resetpassword/:id/:token', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Negative Case - Password mismatch handling
    it('should return 401 if passwords do not match', async () => {
        // Make the request to the endpoint
        const response = await request(app)
            .post('/1/mockToken')
            .send({
                password: 'newpassword',
                confirmPassword: 'differentPassword'
            });

        // Verify the response
        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Password Mismatch!');
    });

    // Negative Case - Invalid token/User id mismatch
    it('should return 401 if token does not match user ID', async () => {
        const mockToken = 'mockToken';
        const mockUserId = '1';

        // Mock database response
        db.query.mockResolvedValueOnce({
            rows: [{ user_id: '2' }] // User ID in database does not match token payload
        });

        // Mock JWT verification
        jwt.verify.mockReturnValue({ user: { id: mockUserId } });

        // Make the request to the endpoint
        const response = await request(app)
            .post(`/${mockUserId}/${mockToken}`)
            .send({
                password: 'newpassword',
                confirmPassword: 'newpassword'
            });

        // Verify the response
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Invalid Link');
    });

    // Positive Case - Check password reset
    it('should reset password successfully if all checks pass', async () => {
        const mockToken = 'mockToken';
        const mockUserId = 1;

        // Mock database response
        db.query.mockResolvedValueOnce({
            rows: [{ user_id: mockUserId }]
        });

        // Mock JWT verification
        jwt.verify.mockReturnValue({ user: { id: mockUserId } });

        // Make the request to the endpoint
        const response = await request(app)
            .post(`/${mockUserId}/${mockToken}`)
            .send({
                password: 'newpassword',
                confirmPassword: 'newpassword'
            });

        // Verify the response
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Password reset successfully!');
    });

    // Negative case - Server error handling
    it('should handle server errors gracefully', async () => {
        // Simulate server error in database query
        db.query.mockRejectedValueOnce(new Error('Database error'));

        // Make the request to the endpoint
        const response = await request(app)
            .post('/1/mockToken')
            .send({
                password: 'newpassword',
                confirmPassword: 'newpassword'
            });

        // Verify the response
        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Server Error');
    });
});