import client from '@sanity/client';

export const projectId = 'oo5ws9d6';
export const dataset = 'production';

export const sanityClient = client({
  projectId,
  dataset,
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});
