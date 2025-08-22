import { Entity, Fields, IdEntity } from "remult";

@Entity<Template>("templates", { allowApiCrud: true })
export class Template extends IdEntity {
    @Fields.string() ownerId = "";
    @Fields.string() name = "";
    @Fields.json() payload: any = {};
}
