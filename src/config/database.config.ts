import { DataSource } from 'typeorm';
import { User } from '../entities/User.entity';
import { VerificationCode } from '../entities/VerificationCode.entity';
import { AuthToken } from '../entities/AuthToken.entity';

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [User, VerificationCode, AuthToken],
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    schema: 'auth',
    connectTimeoutMS: 60000,
    extra: {
        max: 20, // максимальное количество соединений в пуле
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    }
});

export async function initializeDatabase() {
    try {
        console.log('🔄 Connecting to database...');
        await AppDataSource.initialize();
        console.log('✅ Database connected successfully');

        // Проверяем существование схемы
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            // Создаем схему если её нет
            await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS auth`);
            console.log('✅ Schema "auth" ready');
        } catch (error) {
            console.warn('⚠️  Schema creation skipped:', (error as Error).message);
        } finally {
            await queryRunner.release();
        }

    } catch (error) {
        console.error('❌ Database connection failed:', error);

        // Подробная диагностика ошибки
        if (error instanceof Error) {
            if (error.message.includes('ECONNREFUSED')) {
                console.error('💡 Hint: Make sure PostgreSQL is running on the specified host and port');
            } else if (error.message.includes('password authentication failed')) {
                console.error('💡 Hint: Check your database credentials in .env file');
            } else if (error.message.includes('database') && error.message.includes('does not exist')) {
                console.error('💡 Hint: Create the database first using the provided SQL script');
            }
        }

        process.exit(1);
    }
}