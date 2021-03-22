import { sanityClient } from '../../../utils/sanity';

export default async function getContent(request, response) {
  const { method, query: { programId } } = request;

  if (method !== 'GET') {
    response.setHeader('Allow', ['GET']);
    response.status(405).json({ message: `method ${method} not allowed` });
    return;
  }

  try {
    const { topics, program } = await sanityClient.fetch(
      `{
          "topics": *[_type == "topic" && programs[]._ref == "${programId}" && !(_id in path('drafts.**'))] | order(order asc) {
            _id,
            title,
            "image": image.asset-> {
              url,
              metadata {
                lqip
              },
            },
          },
          "program": *[_type == "program" && _id == "${programId}" && !(_id in path('drafts.**'))][0] {
            _id,
            title,
            "location": location-> {
              title,
            },
            email,
            csn,
            classCodes,
          }
        }
      `
    );

    if (!Object.keys(program).length) {
      response.status(404).json({ message: 'no content found for program' });
    } else {
      response.status(200).json({ content: { topics, program } });
    }
  } catch (error) {
    const { description } = JSON.parse(error.responseBody).error;
    const { statusCode } = error.response;

    response.status(statusCode || 500).json({ message: description });
  }
}
