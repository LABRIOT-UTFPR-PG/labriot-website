export type SiteSettings = {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialMedia: {
    twitter: string;
    linkedin: string;
    github: string;
  };
  enableBlog: boolean;
  enableEvents: boolean;
  enableNewsletter: boolean;
};

export const SITE_SETTINGS_ID = "site-settings";

export function createDefaultSiteSettings(): SiteSettings {
  return {
    siteName: "Labriot",
    siteDescription: "Laboratório de Pesquisa em Robótica e Inteligência Artificial",
    contactEmail: "labriot.utfpr@gmail.com",
    contactPhone: "+55 (42) 99999-9999",
    contactAddress: "R. Doutor Washington Subtil Chueire, 330, Jardim Carvalho, Ponta Grossa - PR, 84017-220",
    socialMedia: {
      twitter: "",
      linkedin: "",
      github: "",
    },
    enableBlog: true,
    enableEvents: true,
    enableNewsletter: true,
  };
}
