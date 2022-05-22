import type { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '../../../utils/sanity';

export type GetContentData =
  | {
      data: {
        topics: any[]; // TODO: add proper type
        program: unknown; // TODO: add proper type
      };
    }
  | {
      error: {
        message: string;
      };
    };

export default async function getContent(
  request: NextApiRequest,
  response: NextApiResponse<GetContentData>
) {
  const {
    method,
    query: { programId },
  } = request;

  if (method !== 'GET') {
    response.setHeader('Allow', ['GET']);
    response
      .status(405)
      .json({ error: { message: `method ${method} not allowed` } });
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
      response.status(404).json({ error: { message: 'no content found' } });
    } else {
      response.status(200).json({ data: { topics, program } });
    }
  } catch (error) {
    const { description } = JSON.parse(error.responseBody).error;
    const { statusCode } = error.response;

    response
      .status(statusCode || 500)
      .json({ error: { message: description } });
  }
}
