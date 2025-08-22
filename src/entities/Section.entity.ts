import { Entity, Fields, IdEntity } from "remult";

@Entity<Section>("sections", { allowApiCrud: true })
export class Section extends IdEntity {
    @Fields.string() contextId = "";
    @Fields.string() name = "";
    @Fields.number() order = 0;
}
