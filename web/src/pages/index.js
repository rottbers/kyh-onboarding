import Head from 'next/head';

import Header from '../components/Header';
import TopicsProgress from '../components/TopicsProgress';
import TopicsGrid from '../components/TopicsGrid';

import { useFirebase } from '../contexts/Firebase';
import sanityClient from '../utils/sanityClient';

export default function TopicsPage({ allTopics }) {
  const { user } = useFirebase();

  const topics = allTopics; // TODO: filter topics based on users location & program
  const unreadTopics = topics.filter((topic) => !user?.readTopics?.includes(topic._id)); // prettier-ignore
  const readTopics = topics.filter((topic) => user?.readTopics?.includes(topic._id)); // prettier-ignore

  return (
    <>
      <Head>
        <title>Topics board | KYH Onboarding</title>
      </Head>
      <Header isDarkBackground={false} />
      <main className="p-4 container mx-auto">
        <h1 className="text-3xl sm:text-4xl mb-4">Topics board</h1>
        <TopicsProgress
          readTopics={readTopics.length}
          totalTopics={topics.length}
        />
        {unreadTopics.length > 0 && (
          <>
            <h2 className="text-2xl mt-8 sm:mt-12 mb-2">Unread topics</h2>
            {allTopics ? (
              <TopicsGrid topics={unreadTopics} isRead={false} />
            ) : (
              <p>Hmmm... no topics found 🙈</p>
            )}
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
    `*[_type == "topic"] {
      _id,
      title,
      "image": image.asset->.url,
    }`
  );

  return { props: { allTopics } };
}
