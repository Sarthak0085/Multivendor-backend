// Import necessary dependencies and mocks
import { Request, Response, NextFunction } from 'express';
import { register, createActivationToken } from '../../src/controllers/user.controller';
import User from '../../src/models/user.model'; // Adjust the import path accordingly
import sendEmail from '../../src/utils/sendMail';
import ErrorHandler from '../../src/utils/ErrorHandler'; // Adjust the import path accordingly
import ejs from 'ejs';
import path from 'path';
import jwt from "jsonwebtoken";

// Mocks
jest.mock('../../src/models/user.model'); // Mock User module
jest.mock('../../src/utils/sendMail'); // Mock helper functions module
jest.mock('../../src/utils/ErrorHandler'); // Mock error handler module
jest.mock('../../src/controllers/user.controller')
jest.mock('ejs');

describe('register function', () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            body: {
                fullName: 'John Doe',
                email: 'john@example.com',
                password: 'password123'
            }
        } as Request;

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        next = jest.fn() as unknown as NextFunction;
    });

    it('should register a new user', async () => {
        // Mock User.findOne to return null indicating user doesn't exist
        (User.findOne as jest.Mock).mockResolvedValueOnce(null);

        // Mock createActivationToken function
        (createActivationToken as jest.Mock).mockReturnValueOnce({
            token: 'activationToken',
            activationCode: 'activationCode'
        });

        // Mock ejs.renderFile to return HTML content
        (ejs.renderFile as jest.Mock).mockResolvedValueOnce('<html>Activation mail content</html>');

        // Mock sendEmail function
        (sendEmail as jest.Mock).mockResolvedValueOnce(undefined);

        await register(req, res, next);

        expect(User.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
        expect(createActivationToken).toHaveBeenCalledWith({
            fullName: 'John Doe',
            email: 'john@example.com',
            password: 'password123'
        });
        expect(ejs.renderFile).toHaveBeenCalledWith(expect.any(String), {
            user: { name: 'John Doe' },
            activationCode: 'activationCode'
        });
        expect(sendEmail).toHaveBeenCalledWith({
            email: 'john@example.com',
            subject: 'Activate your account',
            template: 'activationMail.ejs',
            data: {
                user: { name: 'John Doe' },
                activationCode: 'activationCode'
            }
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Please check your email: john@example.com to activate your account.',
            activationToken: 'activationToken'
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should handle existing user', async () => {
        // Mock User.findOne to return an existing user
        (User.findOne as jest.Mock).mockResolvedValueOnce({});

        await register(req, res, next);

        expect(User.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
        expect(next).toHaveBeenCalledWith(new ErrorHandler('User already exists', 400));
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it('should handle missing details', async () => {
        // Modify request to have missing details
        req.body = {};

        await register(req, res, next);

        expect(next).toHaveBeenCalledWith(new ErrorHandler('Please fill all the details', 401));
        expect(User.findOne).not.toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it('should handle email sending error', async () => {
        // Mock User.findOne to return null indicating user doesn't exist
        (User.findOne as jest.Mock).mockResolvedValueOnce(null);

        // Mock createActivationToken function
        (createActivationToken as jest.Mock).mockReturnValueOnce({
            token: 'activationToken',
            activationCode: 'activationCode'
        });

        // Mock ejs.renderFile to return HTML content
        (ejs.renderFile as jest.Mock).mockResolvedValueOnce('<html>Activation mail content</html>');

        // Mock sendEmail function to throw an error
        (sendEmail as jest.Mock).mockRejectedValueOnce(new Error('Email sending failed'));

        await register(req, res, next);

        expect(User.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
        expect(createActivationToken).toHaveBeenCalledWith({
            fullName: 'John Doe',
            email: 'john@example.com',
            password: 'password123'
        });
        expect(ejs.renderFile).toHaveBeenCalledWith(expect.any(String), {
            user: { name: 'John Doe' },
            activationCode: 'activationCode'
        });
        expect(sendEmail).toHaveBeenCalledWith({
            email: 'john@example.com',
            subject: 'Activate your account',
            template: 'activationMail.ejs',
            data: {
                user: { name: 'John Doe' },
                activationCode: 'activationCode'
            }
        });
        expect(next).toHaveBeenCalledWith(new ErrorHandler('Email sending failed', 400));
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it('should handle internal server error', async () => {
        // Mock User.findOne to throw an error
        (User.findOne as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

        await register(req, res, next);

        expect(User.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
        expect(next).toHaveBeenCalledWith(new ErrorHandler('Database error', 500));
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});


jest.mock('jsonwebtoken', () => ({
    sign: jest.fn()
}));

describe('createActivationToken function', () => {
    it('should create an activation token with correct data', () => {
        // Mock the jwt.sign function to return a token
        const mockToken = 'mockToken';
        (jwt.sign as jest.Mock).mockReturnValueOnce(mockToken);

        // Create a user object
        const user = {
            fullName: 'John Doe',
            email: 'john@example.com',
            password: 'password123'
        };

        // Call the function
        const result = createActivationToken(user);

        // Assertion
        expect(result).toHaveProperty('activationCode');
        expect(result).toHaveProperty('token');
        expect(typeof result.activationCode).toBe('string');
        expect(typeof result.token).toBe('string');
        expect(jwt.sign).toHaveBeenCalledWith(
            {
                user,
                activationCode: expect.any(String)
            },
            expect.any(String),
            {
                expiresIn: "5m"
            }
        );
    });
});
