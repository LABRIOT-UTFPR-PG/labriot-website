import { getEventRepository } from "@/lib/repositories/events";
import { getPostRepository } from "@/lib/repositories/posts";
import { getProjectRepository } from "@/lib/repositories/projects";
import { getPublicationRepository } from "@/lib/repositories/publications";
import { getTeamRepository } from "@/lib/repositories/team";

export async function getAdminDashboardStats() {
  try {
    const [projects, team, publications, posts, events] = await Promise.all([
      getProjectRepository().count(),
      getTeamRepository().count(),
      getPublicationRepository().count(),
      getPostRepository().count(),
      getEventRepository().count(),
    ]);

    return { projects, team, publications, posts, events };
  } catch {
    return { projects: 0, team: 0, publications: 0, posts: 0, events: 0 };
  }
}
