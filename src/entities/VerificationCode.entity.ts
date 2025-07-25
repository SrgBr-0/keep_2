import { Entity, Fields, IdEntity } from "remult";
import { User } from "./User.entity";

@Entity("verification_codes", {
    dbName: "auth.verification_codes",
    allowApiCrud: false
})
export class VerificationCode extends IdEntity {
    @Fields.string()
    code!: string;

    @Fields.string({ allowNull: true })
    userAgent?: string;

    @Fields.date()
    expiresAt!: Date;

    @Fields.date({ allowNull: true })
    usedAt?: Date;

    @Fields.boolean()
    isUsed = false;

    @Fields.number()
    attempts = 0;

    @Fields.string()
    userId!: string;

    @Fields.json(() => User)
    user!: User;

    @Fields.createdAt()
    createdAt = new Date();
}