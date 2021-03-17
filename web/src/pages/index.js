import Head from 'next/head';

import Header from '../components/Header';
import TopicsProgress from '../components/TopicsProgress';
import TopicsGrid from '../components/TopicsGrid';

import { useFirebase } from '../contexts/Firebase';
import sanityClient from '../utils/sanityClient';

export default function TopicsPage({ allTopics, allPrograms, allLocations }) {
  const { user } = useFirebase();

  const topics = allTopics.filter((topic) => topic?.programs?.includes(user?.programId)); // prettier-ignore
  const unreadTopics = topics.filter((topic) => !user?.readTopics?.includes(topic._id)); // prettier-ignore
  const readTopics = topics.filter((topic) => user?.readTopics?.includes(topic._id)); // prettier-ignore

  const program = allPrograms.filter(({ _id }) => user?.programId === _id)[0]; // prettier-ignore
  const location = allLocations.filter(({ _id }) => user?.locationId === _id)[0]; // prettier-ignore

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
          programEmail={program?.email}
          programTitle={program?.title}
          locationTitle={location?.title}
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
  const { allTopics, allLocations, allPrograms } = await sanityClient.fetch(
    `{
      "allTopics": *[_type == "topic" && !(_id in path('drafts.**'))] {
        _id,
        title,
        "image": image.asset-> {
          url,
          metadata {
            lqip
          },
        },
        "programs": programs[]->._id,
      },
      "allLocations": *[_type == "location" && !(_id in path('drafts.**'))] {
        _id,
        title,
      },
      "allPrograms": *[_type == "program" && !(_id in path('drafts.**'))] {
        _id,
        title,
        email,
      }
    }`
  );

  return { props: { allTopics, allLocations, allPrograms }, revalidate: 30 };
}
