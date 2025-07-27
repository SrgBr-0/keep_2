import { Entity, Fields, IdEntity } from "remult";

@Entity("users", {
    dbName: "auth.users",
    allowApiCrud: false
})
export class User extends IdEntity {
    @Fields.string()
    email!: string;

    @Fields.string({ allowNull: true })
    passwordHash?: string;

    @Fields.boolean()
    isVerified = false;

    @Fields.boolean()
    isActive = true;

    @Fields.string({ allowNull: true })
    firstName?: string;

    @Fields.string({ allowNull: true })
    lastName?: string;

    @Fields.date({ allowNull: true })
    lastLoginAt?: Date;

    @Fields.createdAt()
    createdAt = new Date();

    @Fields.updatedAt()
    updatedAt?: Date;
}