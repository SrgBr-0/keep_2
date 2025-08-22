import { Entity, Fields, IdEntity } from "remult";

export type MessageType =
    | "CardContent"
    | "CardInfo"
    | "CardSettings"
    | "SectionInfo"
    | "ContextInfo"
    | "ContextSubscribe"
    | "ContentUpload";

@Entity<UpdateMessage>("update_messages", {
    allowApiCrud: true
})
export class UpdateMessage extends IdEntity {
    // Идемпотентный ключ с клиента (nanoid 21)
    @Fields.string({ caption: "clientId" })
    clientId = "";

    // Время сервера (ставим при insert на бэке)
    @Fields.date({ caption: "serverTime" })
    serverTime = new Date();

    @Fields.string<UpdateMessage>()
    type: MessageType = "CardContent";

    @Fields.json()
    data: any = {};

    // Кто послал (для сегрегации)
    @Fields.string()
    userId = "";

    // Для подписок/фильтрации
    @Fields.string({ allowNull: true })
    contextId?: string;
}
