import { client } from '../lib/sanity';

export interface SanityService {
  _id: string;
  title: string;
  description: string;
  content: string;
  iconName: string;
  slug: { current: string };
}

export interface SanitySuburb {
  _id: string;
  name: string;
  region: string;
  slug: { current: string };
}

export const sanityService = {
  async getServices(): Promise<SanityService[]> {
    if (!import.meta.env.VITE_SANITY_PROJECT_ID) return [];
    return client.fetch(`*[_type == "service"] {
      _id,
      title,
      description,
      content,
      iconName,
      slug
    }`);
  },

  async getSuburbs(): Promise<SanitySuburb[]> {
    if (!import.meta.env.VITE_SANITY_PROJECT_ID) return [];
    return client.fetch(`*[_type == "suburb"] {
      _id,
      name,
      region,
      slug
    }`);
  },

  async getServiceBySlug(slug: string): Promise<SanityService | null> {
    if (!import.meta.env.VITE_SANITY_PROJECT_ID) return null;
    return client.fetch(`*[_type == "service" && slug.current == $slug][0]`, { slug });
  },

  async getSuburbBySlug(slug: string): Promise<SanitySuburb | null> {
    if (!import.meta.env.VITE_SANITY_PROJECT_ID) return null;
    return client.fetch(`*[_type == "suburb" && slug.current == $slug][0]`, { slug });
  }
};
