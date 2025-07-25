import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { app } from '../server';

describe('Auth API', () => {
    beforeAll(async () => {
        // Инициализация тестовой БД
    });

    afterAll(async () => {
        // Очистка тестовой БД
    });

    test('should send verification code', async () => {
        const response = await request(app)
            .post('/api/auth/sendCode')
            .send({ email: 'test@example.com' });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    test('should verify code and return token', async () => {
        // Сначала отправляем код
        await request(app)
            .post('/api/auth/sendCode')
            .send({ email: 'test@example.com' });

        // Затем верифицируем (в реальных тестах код нужно получать из БД)
        const response = await request(app)
            .post('/api/auth/verifyCode')
            .send({
                email: 'test@example.com',
                code: '123456' // В реальных тестах - динамический код
            });

        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
    });
});