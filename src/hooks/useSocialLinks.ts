import { useSiteContent } from "./useSiteContent";

const DEFAULTS = {
  instagram: { url: "", active: false },
  facebook: { url: "", active: false },
  tiktok: { url: "", active: false },
  youtube: { url: "", active: false },
};

export function useSocialLinks() {
  const { data } = useSiteContent("social_links", DEFAULTS);
  return data as typeof DEFAULTS;
}
