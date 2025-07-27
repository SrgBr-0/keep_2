import { User } from "./entities/User.entity";
import { VerificationCode } from "./entities/VerificationCode.entity";
import { AuthToken } from "./entities/AuthToken.entity";
import { AuthController } from "./controllers/auth.controller";

export const AppModule = {
    entities: [User, VerificationCode, AuthToken],
    controllers: [AuthController],
};
