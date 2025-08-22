// import { Entity, Fields, IdEntity } from "remult";
//
// @Entity<Card>("cards", { allowApiCrud: true })
// export class Card extends IdEntity {
//     @Fields.string() contextId = "";                // для Inbox — просто указать inbox-context
//     @Fields.string({ allowNull: true }) sectionId?: string; // в Inbox null
//     @Fields.json() content: any = {};               // CardContent
//     @Fields.json({ allowNull: true }) info?: any;   // CardInfo / CardSettings
//     @Fields.date() updatedAt = new Date();
// }
import { Entity, Fields, remult } from "remult";

@Entity("cards", {
    allowApiCrud: true
})
export class Card {
    @Fields.cuid()
    id!: string;

    @Fields.string()
    contextId!: string;

    // sectionId может отсутствовать или быть null
    @Fields.string({ allowNull: true })
    sectionId?: string | null;

    // content может быть чем угодно (json)
    @Fields.json()
    content: any;

    // info тоже json, может быть пустым
    @Fields.json({ allowNull: true })
    info?: any;

    @Fields.date()
    updatedAt!: Date;

    @Fields.createdAt()
    createdAt!: Date;

    @Fields.updatedAt()
    lastModifiedAt!: Date;
}
