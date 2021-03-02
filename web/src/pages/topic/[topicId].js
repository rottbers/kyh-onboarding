import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import ErrorPage from 'next/error';
import { MdDashboard, MdArrowForward } from 'react-icons/md';

import Spinner from '../../components/Spinner';
import Header from '../../components/Header';
import TopicBlockContent from '../../components/TopicBlockContent';
import TopicQuestions from '../../components/TopicQuestions';

import { useFirebase } from '../../contexts/Firebase';
import sanityClient from '../../utils/sanityClient';

export default function TopicPage({ topic, topics }) {
  const { firebase, user } = useFirebase();
  const { isFallback, asPath } = useRouter();

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

  // To prevent the link for the next topic to be focused
  // we reset focus to the topic heading when the URL changes.
  useEffect(() => {
    if (!isNotFound || !isFallback) headingRef.current.focus();
  }, [isNotFound, isFallback, asPath]);

  if (isFallback) return <Spinner fullscreen />;

  if (isNotFound) return <ErrorPage statusCode={404} />;

  // TODO: filter topics based on users location & program
  const nextTopic = topics.filter((topic) => !user?.readTopics?.includes(topic._id))[0]; // prettier-ignore

  const { title, body, image, questions } = topic;

  return (
    <>
      <Head>
        <title>{title} | KYH Onboarding</title>
      </Head>
      <Header isDarkBackground={true} />
      <main className="p-4">
        <article>
          <header
            style={image && { backgroundImage: `url(${image})` }}
            className="bg-center bg-cover bg-gray-900 -mx-4 px-4 -mt-24 pt-32 pb-16 text-white"
          >
            <h1
              className="max-w-2xl mx-auto mt-12 sm:my-12 2xl:my-24 text-4xl sm:text-5xl md:text-6xl lg:text-7xl focus:outline-none"
              tabIndex="-1"
              ref={headingRef}
            >
              {title}
            </h1>
          </header>
          <div className="max-w-2xl mx-auto my-8">
            <TopicBlockContent blocks={body} />
            <TopicQuestions questions={questions} />
          </div>
        </article>
        <nav className="max-w-2xl mx-auto border-t border-gray-200 pt-8 pb-24 flex flex-col sm:flex-row-reverse justify-between">
          {nextTopic ? (
            <Link href={`/topic/${nextTopic._id}`}>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a className="group text-right w-full p-4 mb-4 sm:mb-0 rounded border border-gray-200 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none">
                <p className="text-gray-500 text-sm flex flex-row items-center justify-end">
                  {`Next topic (${user?.readTopics?.length + 1} / ${
                    topics?.length
                  })`}
                  <MdArrowForward
                    aria-hidden={true}
                    className="ml-1 text-brand"
                  />
                </p>
                <p className="font-normal text-gray-700 group-hover:underline group-hover:underline-brand group-focus:underline group-focus:underline-brand">
                  {nextTopic.title}
                </p>
              </a>
            </Link>
          ) : (
            <div className="sm:w-full sm:p4" />
          )}
          <Link href="/">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a className="group w-full p-4 sm:mr-4 rounded border border-gray-200 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none">
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
              <p className="font-normal text-gray-700 group-hover:underline group-focus:underline">
                Browse all topics
              </p>
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
  const { topic, topics } = await sanityClient.fetch(`
    {
      "topic": *[_type == "topic" && _id == "${params.topicId}" && !(_id in path('drafts.**'))][0] {
        _id,
        "image": image.asset->.url,
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
        questions,
      },
      "topics": *[_type == "topic" && !(_id in path('drafts.**'))] {
        _id,
        title,
      }
    }`);

  return { props: { topic, topics }, revalidate: 30 };
}
