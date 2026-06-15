import { canUseMockData, isDatabaseConfigured } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { RepositoryUnavailableError } from "@/lib/repositories/errors";
import { createDefaultSiteSettings, SITE_SETTINGS_ID, type SiteSettings } from "@/lib/site-settings";

export interface SiteSettingsRepository {
  get(): Promise<SiteSettings>;
  save(data: SiteSettings): Promise<SiteSettings>;
}

function mapRecordToSettings(
  record:
    | {
        siteName: string;
        siteDescription: string;
        contactEmail: string;
        contactPhone: string;
        contactAddress: string;
        socialTwitter: string;
        socialLinkedin: string;
        socialGithub: string;
        enableBlog: boolean;
        enableEvents: boolean;
        enableNewsletter: boolean;
      }
    | null
): SiteSettings {
  if (!record) {
    return createDefaultSiteSettings();
  }

  return {
    siteName: record.siteName,
    siteDescription: record.siteDescription,
    contactEmail: record.contactEmail,
    contactPhone: record.contactPhone,
    contactAddress: record.contactAddress,
    socialMedia: {
      twitter: record.socialTwitter,
      linkedin: record.socialLinkedin,
      github: record.socialGithub,
    },
    enableBlog: record.enableBlog,
    enableEvents: record.enableEvents,
    enableNewsletter: record.enableNewsletter,
  };
}

function mapSettingsToRecord(data: SiteSettings) {
  return {
    siteName: data.siteName,
    siteDescription: data.siteDescription,
    contactEmail: data.contactEmail,
    contactPhone: data.contactPhone,
    contactAddress: data.contactAddress,
    socialTwitter: data.socialMedia.twitter,
    socialLinkedin: data.socialMedia.linkedin,
    socialGithub: data.socialMedia.github,
    enableBlog: data.enableBlog,
    enableEvents: data.enableEvents,
    enableNewsletter: data.enableNewsletter,
  };
}

const unavailableSiteSettingsRepository: SiteSettingsRepository = {
  async get() {
    return createDefaultSiteSettings();
  },
  async save() {
    throw new RepositoryUnavailableError();
  },
};

const prismaSiteSettingsRepository: SiteSettingsRepository = {
  async get() {
    const record = await prisma.siteSettings.findUnique({
      where: { id: SITE_SETTINGS_ID },
    });

    return mapRecordToSettings(record);
  },
  async save(data) {
    const record = await prisma.siteSettings.upsert({
      where: { id: SITE_SETTINGS_ID },
      update: mapSettingsToRecord(data),
      create: {
        id: SITE_SETTINGS_ID,
        ...mapSettingsToRecord(data),
      },
    });

    return mapRecordToSettings(record);
  },
};

export function getSiteSettingsRepository() {
  if (isDatabaseConfigured()) {
    return prismaSiteSettingsRepository;
  }

  return canUseMockData() ? fallbackSiteSettingsRepository : unavailableSiteSettingsRepository;
}

const fallbackSiteSettingsRepository: SiteSettingsRepository = {
  async get() {
    return createDefaultSiteSettings();
  },
  async save() {
    throw new RepositoryUnavailableError();
  },
};
