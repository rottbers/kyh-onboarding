import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import ErrorPage from 'next/error';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { MdDashboard, MdArrowForward } from 'react-icons/md';
import {
  Header,
  LoadingPage,
  TopicBlockContent,
  TopicQuestions,
} from '../../components';
import { useContent, useUserDispatch, useUserState } from '../../contexts';
import { sanityClient, groq } from '../../utils/sanity';
import type { Topic } from '../api/content/[programId]';

export default function TopicPage({
  topic,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { readTopics, completedOnboarding } = useUserState();
  const userDispatch = useUserDispatch();
  const { topics, program } = useContent();
  const { isFallback, asPath } = useRouter();
  const [nextTopics, setNextTopics] = useState<Topic[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const isNotFound = !topic || (typeof topic === 'object' && !Object.keys(topic).length); // prettier-ignore

  useEffect(() => {
    const next = topics.filter(({ _id }) => !readTopics?.includes(_id));
    setNextTopics(next);
  }, [topics, readTopics]);

  useEffect(() => {
    if (!isNotFound) {
      userDispatch({ type: 'READ_TOPIC', data: { topicId: topic._id } });
    }
  }, [isNotFound, userDispatch, topic]);

  // To prevent the link for the next topic to remain focused
  // we reset focus to the topic heading when the URL changes.
  useEffect(() => {
    if (!isNotFound && !isFallback && headingRef.current) {
      headingRef.current.focus();
    }
  }, [isNotFound, isFallback, asPath]);

  if (isFallback) {
    return <LoadingPage />;
  }

  if (isNotFound) {
    return <ErrorPage statusCode={404} />;
  }

  const nextTopic = nextTopics[0];

  const { title, body, image, questions, options } = topic;

  return (
    <>
      <Head>
        <title>{title} | KYH Onboarding</title>
      </Head>
      <Header isDarkBackground={true} />
      <main className="p-4">
        <article>
          <header className="relative -mx-4 px-4 -mt-24 pt-32 pb-16 bg-gray-900 text-white">
            {image && (
              <>
                <div
                  className="absolute left-0 top-0 h-full w-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${image?.metadata?.lqip})`,
                  }}
                />
                <div
                  className="absolute z-10 left-0 top-0 h-full w-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${image?.url}?auto=format&w=1920&fit=max&sat=-100&q=70)`,
                  }}
                />
                <div className="absolute z-20 left-0 top-0 h-full w-full bg-gray-900/30 bg-gradient-to-br from-blue/50 to-orange/50" />
              </>
            )}
            <h1
              className="relative z-30 max-w-2xl mx-auto mt-12 sm:my-12 2xl:my-24 text-4xl sm:text-5xl md:text-6xl lg:text-7xl focus:outline-none"
              tabIndex={-1}
              ref={headingRef}
            >
              {title}
            </h1>
          </header>
          <div className="max-w-2xl mx-auto my-8">
            <TopicBlockContent value={body} />
            {options?.showCSN && (
              <>
                {program?.csn ? (
                  // TODO: consider table width on mobile
                  <table className="w-full text-left text-sm sm:text-base mb-4">
                    <thead>
                      <tr>
                        <th>Termin</th>
                        <th>Start</th>
                        <th>Slut</th>
                        <th>Veckor</th>
                        <th>YH poäng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {program.csn.map(
                        ({ semester, startDate, endDate, weeks, points }) => (
                          <tr
                            key={startDate}
                            className="border-t-4 border-transparent"
                          >
                            <td>{semester}</td>
                            <td>{startDate}</td>
                            <td>{endDate}</td>
                            <td>{weeks}</td>
                            <td>{points}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                ) : (
                  <p>
                    Tyvärr, inga ansökningsdatum hittades för din utbildning.
                  </p>
                )}
              </>
            )}
            {options?.showClassCodes && (
              <>
                {program?.classCodes ? (
                  <table className="w-full text-left text-sm sm:text-base mb-4">
                    <thead>
                      <tr>
                        <th>Kurs</th>
                        <th>Kurskod</th>
                      </tr>
                    </thead>
                    <tbody>
                      {program.classCodes.map(({ name, code }) => (
                        <tr
                          key={code}
                          className="border-t-4 border-transparent"
                        >
                          <td>{name}</td>
                          <td>
                            <code className="bg-green bg-opacity-25 px-1">
                              {code}
                            </code>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>Tyvärr, inga kurskoder hittades för din utbildning.</p>
                )}
              </>
            )}
            {questions && <TopicQuestions questions={questions} />}
          </div>
        </article>
        <nav className="max-w-2xl mx-auto border-t border-gray-200 pt-8 pb-24 flex flex-col sm:flex-row-reverse justify-between">
          {completedOnboarding ? (
            <div className="sm:w-full sm:p4" />
          ) : (
            <Link href={nextTopic ? `/topic/${nextTopic._id}` : '/'}>
              <a className="text-right w-full p-4 mb-4 sm:mb-0 rounded border border-gray-200 hover:bg-gray-50 focus-visible:bg-gray-50 focus:outline-none focus-visible:ring">
                <p className="text-gray-500 text-sm flex flex-row items-center justify-end">
                  {nextTopic
                    ? `Nästa ämne (${topics.length - nextTopics.length + 1} / ${
                        topics?.length
                      })`
                    : 'Onboarding avklarad'}
                  <MdArrowForward
                    aria-hidden={true}
                    className="ml-1 text-orange"
                  />
                </p>
                <p className="font-normal text-gray-700">
                  {nextTopic ? nextTopic.title : 'Läs meddelande 🎉'}
                </p>
              </a>
            </Link>
          )}
          <Link href="/">
            <a className="w-full p-4 sm:mr-4 rounded border border-gray-200 hover:bg-gray-50 focus-visible:bg-gray-50 focus:outline-none focus-visible:ring">
              <p className="text-gray-500 text-sm flex flex-row items-center justify-start">
                <span>
                  {' '}
                  <MdDashboard
                    aria-hidden={true}
                    className="mr-1 text-gray-400"
                  />
                </span>
                Ämnen
              </p>
              <p className="font-normal text-gray-700">Se alla ämnen</p>
            </a>
          </Link>
        </nav>
      </main>
    </>
  );
}

type Params = {
  topicId: string;
};

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const query = groq`
    *[_type == "topic" && !(_id in path('drafts.**'))] {
      "topicId": _id
    }
  `;

  const topics = await sanityClient.fetch<Params[]>(query);

  const paths = topics.map(({ topicId }) => ({ params: { topicId } }));

  return { paths, fallback: true };
};

type Data = {
  _id: string;
  image?: {
    metadata: {
      lqip: string;
    };
    url: string;
  };
  title: string;
  body: unknown;
  options: {
    showCSN: boolean;
    showClassCodes: boolean;
  };
  questions?: [
    {
      _key: string;
      question: string;
      answer: any;
    }
  ];
};

export const getStaticProps: GetStaticProps<{ topic: Data }, Params> = async ({
  params,
}) => {
  const query = groq`
    *[_type == "topic" && _id == "${params?.topicId}" && !(_id in path('drafts.**'))][0] {
        _id,
        "image": image.asset-> {
          url,
          metadata {
            lqip
          },
        },
        title,
        body[] {
          ...,
          image {
            ...,
            asset-> {
            ...,
            }
          },
        },
        options,
        questions,
    }
  `;

  const topic = await sanityClient.fetch<Data>(query);

  return { props: { topic }, revalidate: 30 };
};
