import { Entity, Fields, IdEntity } from "remult";

@Entity<Contact>("contact", { allowApiCrud: true })
export class Contact extends IdEntity {
    @Fields.string() ownerId = "";
    @Fields.string() email = "";
    @Fields.string({ allowNull: true }) name?: string;
}
