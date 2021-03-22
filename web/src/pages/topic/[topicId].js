import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import ErrorPage from 'next/error';
import { MdDashboard, MdArrowForward } from 'react-icons/md';

import LoadingPage from '../../components/LoadingPage';
import Header from '../../components/Header';
import TopicBlockContent from '../../components/TopicBlockContent';
import TopicQuestions from '../../components/TopicQuestions';

import { useFirebase } from '../../contexts/Firebase';
import { useContent } from '../../contexts/Content';
import { sanityClient } from '../../utils/sanity';

export default function TopicPage({ topic }) {
  const { firebase, user } = useFirebase();
  const { topics, program } = useContent();
  const { isFallback, asPath } = useRouter();
  const [nextTopics, setNextTopics] = useState([]);

  useEffect(() => {
    const next = topics.filter(({ _id }) => !user?.readTopics?.includes(_id));
    setNextTopics(next);
  }, [topics, user]);

  const isNotFound = !topic || (typeof topic === 'object' && !Object.keys(topic).length); // prettier-ignore

  useEffect(() => {
    if (!user || !firebase || isNotFound) return;

    firebase
      .firestore()
      .doc(`users/${user.uid}`)
      .update({
        readTopics: firebase.firestore.FieldValue.arrayUnion(topic._id),
      });
  }, [firebase, user, isNotFound, topic]);

  const headingRef = useRef();

  // To prevent the link for the next topic to remain focused
  // we reset focus to the topic heading when the URL changes.
  useEffect(() => {
    if (!isNotFound && !isFallback) headingRef.current.focus();
  }, [isNotFound, isFallback, asPath]);

  if (isFallback) return <LoadingPage />;

  if (isNotFound) return <ErrorPage statusCode={404} />;

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
                <div className="absolute z-20 left-0 top-0 h-full w-full bg-gray-900 opacity-70 bg-gradient-to-br from-blue-opacity-70 to-orange-opacity-70" />
              </>
            )}
            <h1
              className="relative z-30 max-w-2xl mx-auto mt-12 sm:my-12 2xl:my-24 text-4xl sm:text-5xl md:text-6xl lg:text-7xl focus:outline-none"
              tabIndex="-1"
              ref={headingRef}
            >
              {title}
            </h1>
          </header>
          <div className="max-w-2xl mx-auto my-8">
            <TopicBlockContent blocks={body} />
            {options?.showCSN && (
              <>
                {program?.csn ? (
                  <table className="w-full text-left text-sm sm:text-base mb-4">
                    <thead>
                      <tr>
                        <th>Start date</th>
                        <th>End date</th>
                        <th>Weeks</th>
                        <th>YH points</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t-4 border-transparent">
                        <td>{program.csn?.firstSemester?.startDate}</td>
                        <td>{program.csn?.firstSemester?.endDate}</td>
                        <td>{program.csn?.firstSemester?.weeks}</td>
                        <td>{program.csn?.firstSemester?.points}</td>
                      </tr>
                      <tr className="border-t-4 border-transparent">
                        <td>{program.csn?.secondSemester?.startDate}</td>
                        <td>{program.csn?.secondSemester?.endDate}</td>
                        <td>{program.csn?.secondSemester?.weeks}</td>
                        <td>{program.csn?.secondSemester?.points}</td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <p>Sorry, no applications dates found for your program.</p>
                )}
              </>
            )}
            {options?.showClassCodes && (
              <>
                {program?.classCodes ? (
                  <table className="w-full text-left text-sm sm:text-base mb-4">
                    <thead>
                      <tr>
                        <th>Class name</th>
                        <th>Class code</th>
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
                  <p>
                    Sorry, no Google classroom codes found for your program.
                  </p>
                )}
              </>
            )}
            <TopicQuestions questions={questions} />
          </div>
        </article>
        <nav className="max-w-2xl mx-auto border-t border-gray-200 pt-8 pb-24 flex flex-col sm:flex-row-reverse justify-between">
          {user?.completedOnboarding ? (
            <div className="sm:w-full sm:p4" />
          ) : (
            <Link href={nextTopic ? `/topic/${nextTopic._id}` : '/'}>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a className="text-right w-full p-4 mb-4 sm:mb-0 rounded border border-gray-200 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring">
                <p className="text-gray-500 text-sm flex flex-row items-center justify-end">
                  {nextTopic
                    ? `Next topic (${topics.length - nextTopics.length + 1} / ${
                        topics?.length
                      })`
                    : 'Onboarding complete'}
                  <MdArrowForward
                    aria-hidden={true}
                    className="ml-1 text-orange"
                  />
                </p>
                <p className="font-normal text-gray-700">
                  {nextTopic ? nextTopic.title : 'Read message 🎉'}
                </p>
              </a>
            </Link>
          )}
          <Link href="/">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a className="w-full p-4 sm:mr-4 rounded border border-gray-200 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring">
              <p className="text-gray-500 text-sm flex flex-row items-center justify-start">
                <span>
                  {' '}
                  <MdDashboard
                    aria-hidden={true}
                    className="mr-1 text-gray-400"
                  />
                </span>
                Topics board
              </p>
              <p className="font-normal text-gray-700">Browse all topics</p>
            </a>
          </Link>
        </nav>
      </main>
    </>
  );
}

export async function getStaticPaths() {
  const topics = await sanityClient.fetch(
    `*[_type == "topic" && !(_id in path('drafts.**'))] {
      _id
    }`
  );

  const paths = topics.map((topic) => ({ params: { topicId: topic._id } }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  const topic = await sanityClient.fetch(
    `*[_type == "topic" && _id == "${params.topicId}" && !(_id in path('drafts.**'))][0] {
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
    }`
  );

  return { props: { topic }, revalidate: 30 };
}
