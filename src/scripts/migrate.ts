import 'dotenv/config';
import { AppDataSource } from '../config/database.config';

async function runMigrations() {
    try {
        await AppDataSource.initialize();
        console.log('✅ Connected to database');

        await AppDataSource.synchronize();
        console.log('✅ Database synchronized successfully');

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

runMigrations();