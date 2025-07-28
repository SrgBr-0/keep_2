import {Allow, BackendMethod, Remult, remult} from "remult";
import { sendVerificationCode, loginWithCode, loginWithPassword, changePassword, logoutAll } from "../shared/auth/auth.helpers";

export class AuthController {
    @BackendMethod({ allowed: true })
    static async sendCode(email: string, userAgent?: string) {
        console.log('📧 sendCode called with:', { email, userAgent });
        try {
            const result = await sendVerificationCode(email, userAgent);
            console.log('✅ sendCode success:', result);
            return result;
        } catch (error) {
            console.error('❌ sendCode error:', error);
            throw error;
        }
    }

    @BackendMethod({ allowed: true })
    static async login(email: string, code?: string, password?: string ) {
        console.log('🔑 login called with:', {
            email: email,
            hasCode: !!code,
            hasPassword: !!password
        });

        try {
            // Проверяем что передан либо код, либо пароль
            if (!code && !password) {
                throw new Error("Either code or password is required");
            }

            if (code && password) {
                throw new Error("Provide either code or password, not both");
            }

            let result;
            if (code) {
                // Логин с кодом из email
                console.log('🔑 Logging in with verification code');
                result = await loginWithCode(email, code);
            } else if (password) {
                // Логин с паролем
                console.log('🔐 Logging in with password');
                result = await loginWithPassword(email, password);
            }

            console.log('✅ login success');
            return result;
        } catch (error) {
            console.error('❌ login error:', error);
            throw error;
        }
    }

    @BackendMethod({ allowed: Allow.authenticated })
    static async changePassword({ newPassword }: { newPassword: string }, rem: Remult) {
        console.log('🔒 changePassword called');
        const userId = rem.user?.id;
        if (!userId) {
            console.error('❌ changePassword: User not authenticated');
            throw new Error("User not authenticated");
        }
        try {
            const result = await changePassword(userId, newPassword);
            console.log('✅ changePassword success');
            return result;
        } catch (error) {
            console.error('❌ changePassword error:', error);
            throw error;
        }
    }

    @BackendMethod({ allowed: Allow.authenticated })
    static async logoutAll() {
        console.log('🚪 logoutAll called');
        const userId = remult.user?.id;
        if (!userId) {
            console.error('❌ logoutAll: User not authenticated');
            throw new Error("User not authenticated");
        }
        try {
            const result = await logoutAll(userId);
            console.log('✅ logoutAll success');
            return result;
        } catch (error) {
            console.error('❌ logoutAll error:', error);
            throw error;
        }
    }

    // Метод для получения информации о текущем пользователе
    @BackendMethod({ allowed: Allow.authenticated })
    static async me(rem: Remult) {
        return {
            user: rem.user,
            authenticated: true
        };
    }
}