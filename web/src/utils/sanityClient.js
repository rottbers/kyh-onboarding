import sanityClient from '@sanity/client';

export default sanityClient({
  projectId: 'oo5ws9d6',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});
