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

    // Находим или создаем пользователя
    let user = await userRepo.findFirst({ email: email.toLowerCase() });
    if (!user) {
        user = await userRepo.insert({
            id: crypto.randomUUID(),
            email: email.toLowerCase(),
            isVerified: false
        });
    }

    // Проверяем лимит запросов (не более 3 кодов за час)
    const oneHourAgo = new Date(Date.now() - 60 * 60000);
    const recentCodes = await codeRepo.find({
        where: {
            userId: user.id
        }
    });

    const recentCodesCount = recentCodes.filter(c => c.createdAt > oneHourAgo).length;

    if (recentCodesCount >= 3) {
        throw "Too many verification attempts. Please try again later.";
    }

    // Генерируем 6-значный код
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Удаляем старые неиспользованные коды
    const oldCodes = await codeRepo.find({
        where: {
            userId: user.id,
            isUsed: false
        }
    });

    for (const oldCode of oldCodes) {
        await codeRepo.delete(oldCode);
    }

    // Сохраняем новый код
    await codeRepo.insert({
        id: crypto.randomUUID(),
        userId: user.id,
        code,
        expiresAt: new Date(Date.now() + 15 * 60000), // 15 минут
        userAgent
    });

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

    return { success: true, message: "Verification code sent successfully" };
}

export async function verifyCode(email: string, code: string) {
    const userRepo = repo(User);
    const codeRepo = repo(VerificationCode);
    const tokenRepo = repo(AuthToken);

    const user = await userRepo.findFirst({ email: email.toLowerCase() });
    if (!user) throw "User not found";

    const verificationCode = await codeRepo.findFirst({
        userId: user.id,
        code,
        isUsed: false
    });

    if (!verificationCode) {
        throw "Invalid verification code";
    }

    // Проверяем не истек ли код
    if (verificationCode.expiresAt < new Date()) {
        throw "Verification code expired";
    }

    // Проверяем количество попыток
    if (verificationCode.attempts >= 3) {
        throw "Too many failed attempts. Please request a new code.";
    }

    // Помечаем код как использованный
    await codeRepo.update(verificationCode, {
        isUsed: true,
        usedAt: new Date()
    });

    // Помечаем пользователя как верифицированного
    await userRepo.update(user, { isVerified: true });

    // Генерируем безопасный токен
    const token = crypto.randomBytes(32).toString('hex');

    // Сохраняем токен
    await tokenRepo.insert({
        id: crypto.randomUUID(),
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60000), // 7 дней
    });

    return {
        token,
        userId: user.id,
        user: {
            id: user.id,
            email: user.email,
            isVerified: user.isVerified
        }
    };
}

export async function changePassword(userId: string, newPassword: string) {
    const userRepo = repo(User);
    const tokenRepo = repo(AuthToken);

    if (newPassword.length < 8) {
        throw "Password must be at least 8 characters long";
    }

    // Проверяем сложность пароля
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);
    const hasNonalphas = /\W/.test(newPassword);

    if (!(hasUpperCase && hasLowerCase && hasNumbers && hasNonalphas)) {
        throw "Password must contain uppercase, lowercase, number and special character";
    }

    // Обновляем пароль
    const passwordHash = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS || '12'));
    const user = await userRepo.findId(userId);
    if (user) {
        await userRepo.update(user, { passwordHash });
    }

    // Отзываем все активные токены
    const activeTokens = await tokenRepo.find({
        where: {
            userId,
            isRevoked: false
        }
    });

    for (const token of activeTokens) {
        if (token.expiresAt > new Date()) {
            await tokenRepo.update(token, {
                isRevoked: true,
                updatedAt: new Date()
            });
        }
    }

    return { success: true, message: "Password changed successfully" };
}

export async function logoutAll(userId: string) {
    const tokenRepo = repo(AuthToken);

    // Находим все активные токены пользователя
    const activeTokens = await tokenRepo.find({
        where: {
            userId,
            isRevoked: false
        }
    });

    // Отзываем каждый активный токен, который еще не истек
    for (const token of activeTokens) {
        if (token.expiresAt > new Date()) {
            await tokenRepo.update(token, {
                isRevoked: true,
                updatedAt: new Date()
            });
        }
    }

    return { success: true, message: "Logged out from all devices" };
}