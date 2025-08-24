import { Entity, Fields, IdEntity } from "remult";

@Entity<Project>("project", { allowApiCrud: true })
export class Project extends IdEntity {
    @Fields.string() ownerId = "";
    @Fields.string() name = "";
    @Fields.string({ allowNull: true }) description?: string;
}
