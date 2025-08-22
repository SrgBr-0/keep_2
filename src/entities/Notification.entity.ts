import { Entity, Fields, IdEntity } from "remult";

@Entity<Notification>("notifications", { allowApiCrud: true })
export class Notification extends IdEntity {
    @Fields.string() userId = "";
    @Fields.string() title = "";
    @Fields.string({ allowNull: true }) body?: string;
    @Fields.boolean() read = false;
    @Fields.date() createdAt = new Date();
}
