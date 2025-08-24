import { BackendMethod, remult } from "remult";
import { repo } from "remult";
import { UpdateMessage, MessageType } from "../entities/UpdateMessage.entity";
import { Card } from "../entities/Card.entity";

export interface MessageQ {
    id: string;                 // nanoid(21)
    time?: string | Date;       // игнорируем, ставим serverTime сами
    type: MessageType | string;
    data: any;
    contextId?: string;
}

export class UpdatesController {
    /**
     * Пачечная отправка изменений (max 50). Идемпотентность по clientId.
     * На дубликат отвечаем OK.
     */
    @BackendMethod({ allowed: true })
    static async postBatch(messages: MessageQ[]) {
        const u = remult.user;
        if (!u?.id) throw new Error("unauthorized");
        if (!Array.isArray(messages) || messages.length === 0)
            throw new Error("empty payload");
        if (messages.length > 50) throw new Error("max 50 messages");

        const msgRepo = repo(UpdateMessage);
        const results: Array<{ id: string; status: "ok" | "error"; error?: string }> = [];

        for (const raw of messages) {
            const clientId = String(raw?.id ?? "");
            const type = String(raw?.type ?? "");
            if (!clientId || !type) {
                results.push({ id: clientId || "?", status: "error", error: "invalid" });
                continue;
            }

            // идемпотентность: по clientId+userId
            const exists = await msgRepo.findFirst({ clientId, userId: u.id });
            if (exists) {
                results.push({ id: clientId, status: "ok" });
                continue;
            }

            try {
                const saved = await msgRepo.insert({
                    clientId,
                    type: type as MessageType,
                    data: raw.data ?? {},
                    serverTime: new Date(),
                    userId: u.id,
                    contextId: raw.contextId
                });

                // Минимальная доменная обработка
                if (type === "CardContent" || type === "ContentUpload") {
                    const { cardId, content } = raw.data ?? {};
                    if (cardId) {
                        const cRepo = repo(Card);
                        const card = await cRepo.findId(cardId).catch(() => null);
                        if (card) {
                            card.content = content ?? card.content;
                            card.updatedAt = new Date();
                            await cRepo.save(card);
                        }
                    }
                }
                // CardInfo / CardSettings / SectionInfo / ContextInfo — добавить по мере нужды

                results.push({ id: clientId, status: "ok" });
            } catch (e: any) {
                const msg = String(e?.message ?? e);
                // если вдруг уникальный индекс сработал — тоже "ok"
                if (msg.includes("duplicate") || msg.includes("unique")) {
                    results.push({ id: clientId, status: "ok" });
                } else {
                    results.push({ id: clientId, status: "error", error: msg });
                }
            }
        }
        return { results };
    }

    /**
     * Получить обновления по контексту (срез за период).
     */
    @BackendMethod({ allowed: true })
    static async getByContext({ contextId, since }: { contextId: string, since?: Date}) {
        const u = remult.user;
        if (!u?.id) throw new Error("unauthorized");
        if (!contextId) throw new Error("contextId required");

        const msgRepo = repo(UpdateMessage);
        const where: any = { userId: u.id, contextId };
        if (since) where.serverTime = { $gte: new Date(since) };

        return await msgRepo.find({ where, orderBy: { serverTime: "asc" }, limit: 500 });
    }
}
