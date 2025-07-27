import {Allow, BackendMethod, Remult, remult} from "remult";
import { sendVerificationCode, verifyCode, changePassword, logoutAll } from "../shared/auth/auth.helpers";

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
    static async verifyCode(email: string, code: string) {
        console.log('🔑 verifyCode called with:', { email, code: code.replace(/./g, '*') });
        try {
            const result = await verifyCode(email, code);
            console.log('✅ verifyCode success');
            return result;
        } catch (error) {
            console.error('❌ verifyCode error:', error);
            throw error;
        }
    }

    @BackendMethod({ allowed: Allow.authenticated })
    static async changePassword(newPassword: string, rem: Remult) {
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
}