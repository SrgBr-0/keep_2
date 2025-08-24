import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { remultExpress } from "remult/remult-express";
import { initializeDatabase } from "./config/database.config";
import { errorHandler } from "./middleware/error.middleware";
import { logger } from "./utils/logger";
import { createPostgresDataProvider } from "remult/postgres";
import {repo} from "remult";

// Импортируем все сущности и контроллеры явно
import { User } from "./entities/User.entity";
import { VerificationCode } from "./entities/VerificationCode.entity";
import { AuthToken } from "./entities/AuthToken.entity";
import { AuthController } from "./controllers/auth.controller";

import { UpdateMessage } from "./entities/UpdateMessage.entity";
import { Contact } from "./entities/Contact.entity";
import { Project } from "./entities/Project.entity";
import { AppContext } from "./entities/AppContext.entity";
import { Section } from "./entities/Section.entity";
import { Card } from "./entities/Card.entity";
import { Template } from "./entities/Template.entity";
import { Notification } from "./entities/Notification.entity";
import { ContextUser } from "./entities/ContextUser.entity";

import { UpdatesController } from "./controllers/updates.controller";
import { ContextsController } from "./controllers/contexts.controller";
import { ProjectsController } from "./controllers/projects.controller";
import { ContactsController } from "./controllers/contacts.controller";

async function startServer() {
    try {
        // Инициализируем базу данных
        await initializeDatabase();

        const app = express();
        const port = process.env.PORT || 3000;

        // Middleware
        app.use(cors());
        app.use(express.json());

        // Создаем Remult API с настройкой аутентификации
        const api = remultExpress({
            entities: [
                User, VerificationCode, AuthToken,
                UpdateMessage, Contact, Project, AppContext, Section, Card, Template, Notification, ContextUser
            ],
            controllers: [
                AuthController,
                UpdatesController, ContextsController, ProjectsController, ContactsController
            ],
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

        app.use(api);

        // Error handling
        app.use(errorHandler);

        app.listen(port, () => {
            logger.info(`🚀 Server started on port ${port}`);
            logger.info(`📊 Admin panel: http://localhost:${port}/api/admin`);
            logger.info(`🔧 Environment: ${process.env.NODE_ENV}`);
        });

    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();