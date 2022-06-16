import { ClientError } from '@sanity/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient, groq } from '../../../utils/sanity';

export type Program = {
  _id: string;
  title: string;
  classCodes: [
    {
      _type: 'classCode';
      code: string;
      name: string;
    }
  ];
  csn: [
    {
      _type: 'csnDate';
      endDate: string;
      points: number;
      semester: string;
      startDate: string;
      weeks: number;
    }
  ];
  email: string;
  location: {
    title: string;
  };
};

export type Topic = {
  _id: string;
  title: string;
  image?: {
    metadata: {
      lqip: string;
    };
    url: string;
  };
};

type Data = {
  program: Program;
  topics: Topic[];
};

export type GetContentData = {
  data?: Data;
  error?: {
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
    const query = groq`
    {
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
    `;

    const { program, topics } = await sanityClient.fetch<Data>(query);

    if (!Object.keys(program).length) {
      response.status(404).json({ error: { message: 'no content found' } });
    } else {
      response.status(200).json({ data: { topics, program } });
    }
  } catch (error) {
    let statusCode = 500;
    let message = 'Something went wrong';

    if (error instanceof ClientError) {
      statusCode = error.statusCode;
      message = error.message;
    }

    response.status(statusCode).json({ error: { message } });
  }
}
