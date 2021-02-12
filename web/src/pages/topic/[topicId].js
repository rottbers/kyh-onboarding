import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import BlockContent from '@sanity/block-content-to-react';
import { MdDashboard, MdArrowForward } from 'react-icons/md';

import Header from '../../components/Header';
import TopicQuestion from '../../components/TopicQuestion';

import { useFirebase } from '../../contexts/Firebase';
import sanityClient from '../../utils/sanityClient';

export default function TopicPage({ topic }) {
  const { firebase, user } = useFirebase();

  useEffect(() => {
    if (!user || !firebase) return;

    firebase
      .firestore()
      .doc(`users/${user.uid}`)
      .update({
        readTopics: firebase.firestore.FieldValue.arrayUnion(topic._id),
      });
  }, [user, firebase]);

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
          <div className="topic-content max-w-2xl mx-auto my-6">
            <BlockContent blocks={body} />
            {questions && (
              <>
                <h2>Frequently asked questions</h2>
                {questions.map(({ _key, question, answer }) => (
                  <TopicQuestion
                    key={_key}
                    questionHeading={question}
                    answerBody={answer}
                  />
                ))}
              </>
            )}
          </div>
        </article>
        <nav className="max-w-2xl mx-auto flex flex-row-reverse justify-between border-t border-gray-200 pt-4">
          <div className="text-right w-1/2">
            <p>
              <span className="text-gray-600 inline-flex items-center">
                Next topic <MdArrowForward className="inline-block ml-1" />
              </span>
            </p>
            {/* TODO: make dynamic based on users unread topics */}
            <Link href="/topic/8f1f15f4-4a15-4338-a1a4-83878e3df9b7">
              <a className="font-normal underline">The Stockholm facilities</a>
            </Link>
          </div>
          <div className="w-1/2">
            <p>
              <span className="text-gray-600 inline-flex items-center">
                <MdDashboard className="inline-block mr-1" />
                Topics board
              </span>
            </p>
            <Link href="/">
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
    `*[_type == "topic"] {
      _id
    }`
  );

  const paths = topics.map((topic) => ({ params: { topicId: topic._id } }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const topic = await sanityClient.fetch(
    `*[_type == "topic" && _id == "${params.topicId}"][0] {
      _id,
      "image": image.asset->.url,
      title,
      body[] {
        ...,
        asset-> {
          ...,
          "_key": _id
        },
      },
      questions,
  }`
  );

  return { props: { topic } };
}
