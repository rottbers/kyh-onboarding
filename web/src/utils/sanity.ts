import client from '@sanity/client';

export { default as groq } from 'groq';

export const sanityClient = client({
  apiVersion: '2021-03-24',
  projectId: 'oo5ws9d6',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});
