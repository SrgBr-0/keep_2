import { BackendMethod, remult } from "remult";
import { repo } from "remult";
import { AppContext } from "../entities/AppContext.entity";
import { Card } from "../entities/Card.entity";

export class ContextsController {
    @BackendMethod({ allowed: true })
    static async pin({contextId}: {contextId: string}) {
        const u = remult.user;
        const cRepo = repo(AppContext);
        const ctx = await cRepo.findId(contextId);
        if (!ctx || ctx.ownerId !== u?.id) throw new Error("forbidden");
        ctx.pinned = true;
        return await cRepo.save(ctx);
    }

    @BackendMethod({ allowed: true })
    static async unpin({contextId}: {contextId: string}) {
        const u = remult.user;
        const cRepo = repo(AppContext);
        const ctx = await cRepo.findId(contextId);
        if (!ctx || ctx.ownerId !== u?.id) throw new Error("forbidden");
        ctx.pinned = false;
        return await cRepo.save(ctx);
    }

    // Inbox: создать карточку без секций
    @BackendMethod({ allowed: true })
    static async createInboxCard({ inboxContextId, content, info }: { inboxContextId: string, content: any, info?: any}) {
        const u = remult.user;
        if (!u?.id) throw new Error("unauthorized");
        const cRepo = repo(Card);
        return await cRepo.insert({
            contextId: inboxContextId,
            sectionId: null,
            content: content ?? {},
            info: info ?? null,
            updatedAt: new Date()
        });
    }
}
