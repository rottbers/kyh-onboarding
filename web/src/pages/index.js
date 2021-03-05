import Head from 'next/head';

import Header from '../components/Header';
import TopicsProgress from '../components/TopicsProgress';
import TopicsGrid from '../components/TopicsGrid';

import { useFirebase } from '../contexts/Firebase';
import sanityClient from '../utils/sanityClient';

export default function TopicsPage({ allTopics }) {
  const { user } = useFirebase();

  const topics = allTopics.filter((topic) => topic?.programs?.includes(user?.programId)); // prettier-ignore
  const unreadTopics = topics.filter((topic) => !user?.readTopics?.includes(topic._id)); // prettier-ignore
  const readTopics = topics.filter((topic) => user?.readTopics?.includes(topic._id)); // prettier-ignore

  return (
    <>
      <Head>
        <title>Topics board | KYH Onboarding</title>
      </Head>
      <Header isDarkBackground={false} />
      <main className="p-4 container mx-auto">
        <h1 className="sr-only">Topics board</h1>
        <TopicsProgress
          readTopics={readTopics.length}
          totalTopics={topics.length}
        />
        {!topics.length && (
          <>
            <h2 className="text-2xl mt-8 sm:mt-12 mb-2">Topics</h2>
            <p>
              Sorry... no topics found{' '}
              <span role="img" aria-label="see no evil emoji">
                🙈
              </span>
            </p>
          </>
        )}
        {unreadTopics.length > 0 && (
          <>
            <h2 className="text-2xl mt-8 sm:mt-12 mb-2">
              {readTopics.length ? 'Unread topics' : 'Topics'}
            </h2>
            <TopicsGrid topics={unreadTopics} isRead={false} />
          </>
        )}
        {readTopics.length > 0 && (
          <>
            <h2 className="text-2xl mt-8 sm:mt-12 mb-2">Read topics</h2>
            <TopicsGrid topics={readTopics} isRead={true} />
          </>
        )}
      </main>
    </>
  );
}

export async function getStaticProps() {
  const allTopics = await sanityClient.fetch(
    `*[_type == "topic" && !(_id in path('drafts.**'))] {
      _id,
      title,
      "image": image.asset->.url,
      "programs": programs[]->._id,
    }`
  );

  return { props: { allTopics }, revalidate: 30 };
}
