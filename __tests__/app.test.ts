// app.test.ts

import express, { Request, Response } from 'express';
import supertest from 'supertest';
import app from '../src/app';

describe('Express App Setup', () => {
    const request = supertest(app);

    it('should respond with "Ok" when GET request is made to /', async () => {
        const response = await request.get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Ok');
    });

    it('should respond with 404 for unknown routes', async () => {
        const response = await request.get('/nonexistent-route');
        expect(response.status).toBe(404);
    });

    it('should apply JSON middleware with proper limit', async () => {
        // You may need to make a mock request here and check if it accepts JSON data properly
    });

    // Test other middleware and configurations as necessary
});
