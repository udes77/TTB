import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
// Use a stable API version by default to avoid propagation issues with "today's" date
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2024-02-24';

export const client = projectId 
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    })
  : null;

const builder = client ? imageUrlBuilder(client) : null;

export function urlFor(source: any) {
  return builder ? builder.image(source) : null;
}
