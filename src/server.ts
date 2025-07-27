import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { remultExpress } from "remult/remult-express";
import { initializeDatabase } from "./config/database.config";
import { errorHandler } from "./middleware/error.middleware";
import { logger } from "./utils/logger";
import { createPostgresDataProvider } from "remult/postgres";
import { repo } from "remult";

// Импортируем все сущности и контроллеры явно
import { User } from "./entities/User.entity";
import { VerificationCode } from "./entities/VerificationCode.entity";
import { AuthToken } from "./entities/AuthToken.entity";
import { AuthController } from "./controllers/auth.controller";

async function startServer() {
    try {
        // Инициализируем базу данных
        await initializeDatabase();

        const app = express();
        const port = process.env.PORT || 3000;

        // Middleware
        app.use(cors());
        app.use(express.json());

        // Логируем что мы регистрируем
        console.log('📋 Registering entities and controllers...');
        console.log('- Entities:', ['User', 'VerificationCode', 'AuthToken']);
        console.log('- Controllers:', ['AuthController']);

        // Создаем Remult API с настройкой аутентификации
        const api = remultExpress({
            entities: [User, VerificationCode, AuthToken],
            controllers: [AuthController],
            dataProvider: createPostgresDataProvider({
                connectionString: process.env.DATABASE_URL!,
                schema: 'auth'
            }),
            admin: process.env.NODE_ENV === 'development',
            logApiEndPoints: process.env.NODE_ENV === 'development',
            // Настройка аутентификации
            getUser: async (request) => {
                const token = request.headers.authorization?.replace('Bearer ', '');
                if (!token) return undefined;

                try {
                    const tokenRepo = repo(AuthToken);
                    const authToken = await tokenRepo.findFirst({
                        token,
                        isRevoked: false
                    });

                    if (!authToken) return undefined;

                    // Проверяем что токен не истек
                    if (authToken.expiresAt < new Date()) return undefined;

                    const userRepo = repo(User);
                    const user = await userRepo.findId(authToken.userId);

                    if (!user || !user.isActive) return undefined;

                    // Обновляем время последнего входа
                    await userRepo.update(user, { lastLoginAt: new Date() });

                    return {
                        id: user.id,
                        email: user.email,
                        name: (user.firstName || '') + ' ' + (user.lastName || ''),
                        roles: [] // Добавьте роли если нужно
                    };
                } catch (error) {
                    console.error('Auth error:', error);
                    return undefined;
                }
            }
        });

        app.use('/api', api);

        // Health check endpoint
        app.get('/health', (req, res) => {
            res.json({
                status: 'ok',
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV,
                endpoints: [
                    'POST /api/sendCode',
                    'POST /api/verifyCode',
                    'POST /api/changePassword',
                    'POST /api/logoutAll',
                    'GET /api/admin'
                ]
            });
        });

        // Debug endpoint для проверки доступных методов
        app.get('/debug/endpoints', (req, res) => {
            res.json({
                message: 'Available backend methods',
                methods: [
                    'AuthController.sendCode',
                    'AuthController.verifyCode',
                    'AuthController.changePassword',
                    'AuthController.logoutAll'
                ],
                note: 'Use POST requests to /api/{methodName}',
                auth: 'Use Authorization: Bearer {token} for protected endpoints'
            });
        });

        // Error handling
        app.use(errorHandler);

        app.listen(port, () => {
            logger.info(`🚀 Server started on port ${port}`);
            logger.info(`📊 Admin panel: http://localhost:${port}/api/admin`);
            logger.info(`🏥 Health check: http://localhost:${port}/health`);
            logger.info(`🔍 Debug endpoints: http://localhost:${port}/debug/endpoints`);
            logger.info(`👤 Auth test: http://localhost:${port}/api/me`);
            logger.info(`🔧 Environment: ${process.env.NODE_ENV}`);
        });

    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();