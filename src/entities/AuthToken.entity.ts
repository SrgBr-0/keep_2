import { Entity, Fields, IdEntity } from "remult";
import { User } from "./User.entity";

@Entity("auth_tokens", {
    dbName: "auth.auth_tokens",
    allowApiCrud: false
})
export class AuthToken extends IdEntity {
    @Fields.string()
    token!: string;

    @Fields.json({ allowNull: true })
    deviceInfo?: object;

    @Fields.date()
    expiresAt!: Date;

    @Fields.boolean()
    isRevoked = false;

    @Fields.string()
    userId!: string;

    @Fields.json(() => User)
    user!: User;

    @Fields.createdAt()
    createdAt = new Date();

    @Fields.updatedAt()
    updatedAt?: Date;
}