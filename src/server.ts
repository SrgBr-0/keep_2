import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { remultExpress } from "remult/remult-express";
import { AppModule } from "./app.module";
import { initializeDatabase } from "./config/database.config";
import { errorHandler } from "./middleware/error.middleware";
import { logger } from "./utils/logger";
import { createPostgresDataProvider } from "remult/postgres";

async function startServer() {
    try {
        // Инициализируем базу данных
        await initializeDatabase();

        const app = express();
        const port = process.env.PORT || 3000;

        // Middleware
        app.use(cors());
        app.use(express.json());

        // Создаем Remult API
        const api = remultExpress({
            ...AppModule,
            dataProvider: createPostgresDataProvider({
                connectionString: process.env.DATABASE_URL!,
                schema: 'auth'
            }),
            admin: process.env.NODE_ENV === 'development'
        });

        app.use('/api', api);

        // Health check endpoint
        app.get('/health', (req, res) => {
            res.json({
                status: 'ok',
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV
            });
        });

        // Error handling
        app.use(errorHandler);

        app.listen(port, () => {
            logger.info(`🚀 Server started on port ${port}`);
            logger.info(`📊 Admin panel: http://localhost:${port}/api/admin`);
            logger.info(`🏥 Health check: http://localhost:${port}/health`);
        });

    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();