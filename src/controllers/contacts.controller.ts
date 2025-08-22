import { BackendMethod, remult, repo } from "remult";
import { ContextUser } from "../entities/ContextUser.entity";
import { AppContext } from "../entities/AppContext.entity";

export class ContactsController {
    @BackendMethod({ allowed: true })
    static async sharedContextsWith(userId: string) {
        const u = remult.user;
        if (!u?.id) throw new Error("unauthorized");
        const links = await repo(ContextUser).find({ where: { userId } });
        const ctxIds = links.map(l => l.contextId);
        if (ctxIds.length === 0) return [];
        return await repo(AppContext).find({ where: { id: { $in: ctxIds } } });
    }
}
