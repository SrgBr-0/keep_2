import { BackendMethod, remult } from "remult";
import { sendVerificationCode, verifyCode, changePassword, logout, logoutAll } from "../shared/auth/auth.helpers";

export class AuthController {
    @BackendMethod({ allowed: true })
    static async sendCode(email: string, userAgent?: string) {
        return await sendVerificationCode(email, userAgent);
    }

    @BackendMethod({ allowed: true })
    static async verifyCode(email: string, code: string) {
        return await verifyCode(email, code);
    }

    @BackendMethod({ allowed: "signedIn" })
    static async changePassword(newPassword: string) {
        const userId = remult.user?.id;
        if (!userId) throw new Error("User not authenticated");
        return await changePassword(userId, newPassword);
    }

    @BackendMethod({ allowed: "signedIn" })
    static async logout() {
        const token = remult.context.request?.headers?.authorization?.replace('Bearer ', '');
        if (!token) throw "No token provided";
        return await logout(token);
    }

    @BackendMethod({ allowed: "signedIn" })
    static async logoutAll() {
        const userId = remult.user?.id;
        if (!userId) throw new Error("User not authenticated");
        return await logoutAll(userId);
    }
}