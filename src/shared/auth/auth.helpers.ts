import { repo } from "remult";
import { User } from "../../entities/User.entity";
import { VerificationCode } from "../../entities/VerificationCode.entity";
import { AuthToken } from "../../entities/AuthToken.entity";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import crypto from "crypto";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendVerificationCode(email: string, userAgent?: string) {
    const userRepo = repo(User);
    const codeRepo = repo(VerificationCode);

    console.log('📧 Sending verification code to:', email);

    try {
        // Находим или создаем пользователя
        let user = await userRepo.findFirst({ email: email.toLowerCase() });
        if (!user) {
            user = await userRepo.insert({
                id: crypto.randomUUID(),
                email: email.toLowerCase(),
                isVerified: false
            });
            console.log('👤 Created new user:', user.id);
        }

        // Проверяем лимит запросов (не более 3 кодов за час)
        const oneHourAgo = new Date(Date.now() - 60 * 60000);
        const recentCodes = await codeRepo.find({
            where: {
                userId: user.id,
                createdAt: { $gte: oneHourAgo }
            }
        });

        console.log(`🔍 Recent codes count: ${recentCodes.length}`);

        if (recentCodes.length >= 3) {
            console.log('⚠️ Rate limit exceeded');
            throw new Error("Too many verification attempts. Please try again later.");
        }

        // Генерируем 6-значный код
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        console.log('🔑 Generated code for user:', user.id);

        // Удаляем старые неиспользованные коды для этого пользователя
        const oldCodes = await codeRepo.find({
            where: {
                userId: user.id,
                isUsed: false
            }
        });

        for (const oldCode of oldCodes) {
            await codeRepo.delete(oldCode);
        }
        console.log(`🗑️ Deleted ${oldCodes.length} old codes`);

        // Сохраняем новый код
        const newVerificationCode = await codeRepo.insert({
            id: crypto.randomUUID(),
            userId: user.id,
            code,
            expiresAt: new Date(Date.now() + 15 * 60000), // 15 минут
            userAgent,
            attempts: 0,
            isUsed: false
        });
        console.log('💾 Saved new verification code');

        // Отправляем email
        await transporter.sendMail({
            from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
            to: email,
            subject: 'Your Verification Code',
            text: `Your verification code is: ${code}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Verification Code</h2>
                    <p>Your verification code is:</p>
                    <h1 style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 32px; letter-spacing: 5px;">${code}</h1>
                    <p>This code will expire in 15 minutes.</p>
                    <p>If you didn't request this code, please ignore this email.</p>
                </div>
            `,
        });
        console.log('📧 Email sent successfully');

        return { success: true, message: "Verification code sent successfully" };

    } catch (error) {
        console.error('❌ Error in sendVerificationCode:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to send verification code');
    }
}

export async function loginWithCode(email: string, code: string) {
    const userRepo = repo(User);
    const codeRepo = repo(VerificationCode);
    const tokenRepo = repo(AuthToken);

    console.log('🔑 Logging in with code for email:', email);

    try {
        const user = await userRepo.findFirst({ email: email.toLowerCase() });
        if (!user) {
            console.log('❌ User not found');
            throw new Error("User not found");
        }

        const verificationCode = await codeRepo.findFirst({
            userId: user.id,
            code,
            isUsed: false
        });

        if (!verificationCode) {
            console.log('❌ Invalid verification code');
            throw new Error("Invalid verification code");
        }

        // Проверяем не истек ли код
        if (verificationCode.expiresAt < new Date()) {
            console.log('❌ Code expired');
            throw new Error("Verification code expired");
        }

        // Увеличиваем счетчик попыток ПЕРЕД проверкой лимита
        const updatedAttempts = verificationCode.attempts + 1;
        await codeRepo.update(verificationCode, {
            attempts: updatedAttempts
        });

        // Проверяем количество попыток ПОСЛЕ увеличения
        if (updatedAttempts > 3) {
            console.log('❌ Too many attempts');
            throw new Error("Too many failed attempts. Please request a new code.");
        }

        // Помечаем код как использованный
        await codeRepo.update(verificationCode, {
            isUsed: true,
            usedAt: new Date()
        });
        console.log('✅ Code marked as used');

        // Помечаем пользователя как верифицированного
        await userRepo.update(user, {
            isVerified: true,
            lastLoginAt: new Date()
        });
        console.log('✅ User verified');

        // Генерируем безопасный токен
        const token = crypto.randomBytes(32).toString('hex');

        // Сохраняем токен
        await tokenRepo.insert({
            id: crypto.randomUUID(),
            userId: user.id,
            token,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60000), // 7 дней
            isRevoked: false
        });
        console.log('✅ Token created');

        return {
            token,
            userId: user.id,
            user: {
                id: user.id,
                email: user.email,
                isVerified: user.isVerified
            }
        };

    } catch (error) {
        console.error('❌ Error in loginWithCode:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to login with code');
    }
}

export async function changePassword(userId: string, newPassword: string) {
    const userRepo = repo(User);
    const tokenRepo = repo(AuthToken);

    console.log('🔒 Changing password for user:', userId);

    try {
        if (newPassword.length < 8) {
            throw new Error("Password must be at least 8 characters long");
        }

        // Проверяем сложность пароля
        const hasUpperCase = /[A-Z]/.test(newPassword);
        const hasLowerCase = /[a-z]/.test(newPassword);
        const hasNumbers = /\d/.test(newPassword);
        const hasNonalphas = /\W/.test(newPassword);

        if (!(hasUpperCase && hasLowerCase && hasNumbers && hasNonalphas)) {
            throw new Error("Password must contain uppercase, lowercase, number and special character");
        }

        // Обновляем пароль
        const passwordHash = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS || '12'));
        const user = await userRepo.findId(userId);
        if (!user) {
            throw new Error("User not found");
        }

        await userRepo.update(user, { passwordHash });
        console.log('✅ Password updated');

        // Отзываем все активные токены КРОМЕ текущего
        // Получаем текущий токен из контекста (если возможно)
        const activeTokens = await tokenRepo.find({
            where: {
                userId,
                isRevoked: false,
                expiresAt: { $gt: new Date() }
            }
        });

        // Отзываем все токены - пользователь должен войти заново
        for (const token of activeTokens) {
            await tokenRepo.update(token, {
                isRevoked: true,
                updatedAt: new Date()
            });
        }
        console.log(`🚪 Revoked ${activeTokens.length} tokens`);

        return {
            success: true,
            message: "Password changed successfully. Please log in again with your new password."
        };

    } catch (error) {
        console.error('❌ Error in changePassword:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to change password');
    }
}

export async function logoutAll(userId: string) {
    const tokenRepo = repo(AuthToken);

    console.log('🚪 Logging out all devices for user:', userId);

    try {
        // Находим все активные токены пользователя
        const activeTokens = await tokenRepo.find({
            where: {
                userId,
                isRevoked: false,
                expiresAt: { $gt: new Date() }
            }
        });

        // Отзываем каждый активный токен
        for (const token of activeTokens) {
            await tokenRepo.update(token, {
                isRevoked: true,
                updatedAt: new Date()
            });
        }

        console.log(`🚪 Logged out from ${activeTokens.length} devices`);
        return {
            success: true,
            message: `Logged out from all devices (${activeTokens.length} sessions)`
        };

    } catch (error) {
        console.error('❌ Error in logoutAll:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to logout from all devices');
    }
}

export async function loginWithPassword(email: string, password: string) {
    const userRepo = repo(User);
    const tokenRepo = repo(AuthToken);

    console.log('🔐 Logging in with password for email:', email);

    try {
        const user = await userRepo.findFirst({ email: email.toLowerCase() });
        if (!user || !user.passwordHash) {
            console.log('❌ User not found or no password set');
            throw new Error("Invalid email or password");
        }

        if (!user.isActive) {
            console.log('❌ User is not active');
            throw new Error("Account is deactivated");
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            console.log('❌ Invalid password');
            throw new Error("Invalid email or password");
        }

        // Обновляем время последнего входа
        await userRepo.update(user, { lastLoginAt: new Date() });
        console.log('✅ Password verified');

        // Генерируем новый токен
        const token = crypto.randomBytes(32).toString('hex');

        await tokenRepo.insert({
            id: crypto.randomUUID(),
            userId: user.id,
            token,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60000), // 7 дней
            isRevoked: false
        });
        console.log('✅ Token created');

        return {
            token,
            userId: user.id,
            user: {
                id: user.id,
                email: user.email,
                isVerified: user.isVerified
            }
        };

    } catch (error) {
        console.error('❌ Error in loginWithPassword:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to login with password');
    }
}