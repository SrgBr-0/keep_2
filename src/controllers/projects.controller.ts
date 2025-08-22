import { BackendMethod, remult, repo } from "remult";
import { Project } from "../entities/Project.entity";
import { AppContext } from "../entities/AppContext.entity";

export class ProjectsController {
    @BackendMethod({ allowed: true })
    static async contexts(projectId: string) {
        const u = remult.user;
        if (!u?.id) throw new Error("unauthorized");
        return await repo(AppContext).find({ where: { projectId, ownerId: u.id } });
    }

    @BackendMethod({ allowed: true })
    static async attachContext(projectId: string, contextId: string) {
        const u = remult.user;
        if (!u?.id) throw new Error("unauthorized");
        const cRepo = repo(AppContext);
        const ctx = await cRepo.findId(contextId);
        if (!ctx || ctx.ownerId !== u.id) throw new Error("forbidden");
        ctx.projectId = projectId;
        return await cRepo.save(ctx);
    }
}
