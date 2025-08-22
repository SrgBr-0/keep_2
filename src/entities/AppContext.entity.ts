import { Entity, Fields, IdEntity } from "remult";

@Entity<AppContext>("contexts", { allowApiCrud: true })
export class AppContext extends IdEntity {
    @Fields.string() ownerId = "";
    @Fields.string() name = "";
    @Fields.string({ allowNull: true }) projectId?: string;
    @Fields.boolean() isInbox = false; // системный инбокс
    @Fields.boolean() pinned = false;  // быстрый доступ
}
