import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { MdDashboard, MdArrowForward } from 'react-icons/md';

import Header from '../../components/Header';
import TopicBlockContent from '../../components/TopicBlockContent';
import TopicQuestions from '../../components/TopicQuestions';

import { useFirebase } from '../../contexts/Firebase';
import sanityClient from '../../utils/sanityClient';

export default function TopicPage({ topic, topics }) {
  const { firebase, user } = useFirebase();

  useEffect(() => {
    if (!user || !firebase) return;

    firebase
      .firestore()
      .doc(`users/${user.uid}`)
      .update({
        readTopics: firebase.firestore.FieldValue.arrayUnion(topic._id),
      });
  }, [firebase, user, topic]);

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
            <h1 className="max-w-2xl mx-auto mt-12 sm:my-12 2xl:my-24 text-4xl sm:text-5xl md:text-6xl lg:text-7xl ">
              {title}
            </h1>
          </header>
          <div className="max-w-2xl mx-auto my-6">
            <TopicBlockContent blocks={body} />
            <TopicQuestions questions={questions} />
          </div>
        </article>
        <nav className="max-w-2xl mx-auto flex flex-row-reverse justify-between border-t border-gray-200 pt-4">
          <div className="text-right w-1/2">
            {nextTopic && (
              <>
                <p>
                  <span className="text-gray-600 inline-flex items-center">
                    Next topic <MdArrowForward className="inline-block ml-1" />
                  </span>
                </p>
                <Link href={`/topic/${nextTopic._id}`}>
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a className="font-normal underline">{nextTopic.title}</a>
                </Link>
              </>
            )}
          </div>
          <div className="w-1/2">
            <p>
              <span className="text-gray-600 inline-flex items-center">
                <MdDashboard className="inline-block mr-1" />
                Topics board
              </span>
            </p>
            <Link href="/">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a className="font-normal underline">Browse all topics</a>
            </Link>
          </div>
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

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const topic = await sanityClient.fetch(
    `*[_type == "topic" && _id == "${params.topicId}" && !(_id in path('drafts.**'))][0] {
      _id,
      "image": image.asset->.url,
      title,
      body[] {
        ...,
        asset-> {
          ...,
          "_key": _id
        },
        image {
          ...,
          asset-> {
          ...,
          }
        },
      },
      questions,
    }`
  );

  const topics = await sanityClient.fetch(
    `*[_type == "topic" && !(_id in path('drafts.**'))] {
      _id,
      title,
    }`
  );

  return { props: { topic, topics } };
}
