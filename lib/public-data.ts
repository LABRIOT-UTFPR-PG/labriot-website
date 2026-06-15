import { getEventRepository } from "@/lib/repositories/events";
import { getPostRepository } from "@/lib/repositories/posts";
import { getProjectRepository } from "@/lib/repositories/projects";
import { getResearchRepository } from "@/lib/repositories/research";
import { getSiteSettingsRepository } from "@/lib/repositories/site-settings";
import { getTeamRepository } from "@/lib/repositories/team";

function normalizeDate(value: string) {
  return new Date(`${value}T00:00:00`);
}

export async function getPublicProjects() {
  return getProjectRepository().list();
}

export async function getPublicEvents() {
  return getEventRepository().list();
}

export async function getPublicUpcomingEvents(limit = 3) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const events = await getEventRepository().list();

  return events
    .filter((event) => normalizeDate(event.date) >= today)
    .slice(0, limit);
}

export async function getPublicRecentEvents(limit = 3) {
  const events = await getEventRepository().list();

  return events
    .sort((a, b) => normalizeDate(b.date).getTime() - normalizeDate(a.date).getTime())
    .slice(0, limit);
}

export async function getPublicAgendaPreview(limit = 3) {
  const upcomingEvents = await getPublicUpcomingEvents(limit);

  if (upcomingEvents.length > 0) {
    return {
      events: upcomingEvents,
      mode: "upcoming" as const,
    };
  }

  return {
    events: await getPublicRecentEvents(limit),
    mode: "recent" as const,
  };
}

export async function getPublicPosts(limit?: number) {
  const posts = await getPostRepository().list();
  return typeof limit === "number" ? posts.slice(0, limit) : posts;
}

export async function getPublicPostById(id: string) {
  return getPostRepository().getById(id);
}

export async function getPublicResearch() {
  return getResearchRepository().list();
}

export async function getPublicTeam() {
  return getTeamRepository().list();
}

export async function getPublicSiteSettings() {
  return getSiteSettingsRepository().get();
}
