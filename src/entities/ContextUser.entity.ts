import { Entity, Fields, IdEntity } from "remult";

@Entity<ContextUser>("context_users", { allowApiCrud: true })
export class ContextUser extends IdEntity {
    @Fields.string() contextId = "";
    @Fields.string() userId = "";
    @Fields.string({ allowNull: true }) role?: "owner" | "editor" | "viewer";
}
