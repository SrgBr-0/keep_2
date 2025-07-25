import { DataSource } from 'typeorm';
import { User } from '../entities/User.entity';
import { VerificationCode } from '../entities/VerificationCode.entity';
import { AuthToken } from '../entities/AuthToken.entity';

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [User, VerificationCode, AuthToken],
    synchronize: process.env.NODE_ENV === 'development', // Только для разработки!
    logging: process.env.NODE_ENV === 'development',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    schema: 'auth'
});

export async function initializeDatabase() {
    try {
        await AppDataSource.initialize();
        console.log('✅ Database connected successfully');

        if (process.env.NODE_ENV === 'development') {
            await AppDataSource.synchronize();
            console.log('✅ Database synchronized');
        }
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
}