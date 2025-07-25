import 'dotenv/config';
import { AppDataSource } from '../config/database.config';
import nodemailer from 'nodemailer';

async function testConnections() {
    console.log('🔍 Testing connections...\n');

    // Тест базы данных
    try {
        await AppDataSource.initialize();
        console.log('✅ Database connection successful');
        await AppDataSource.destroy();
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
    }

    // Тест SMTP
    try {
        const transporter = nodemailer.createTransporter({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.verify();
        console.log('✅ SMTP connection successful');
    } catch (error) {
        console.error('❌ SMTP connection failed:', error.message);
    }
}

testConnections();