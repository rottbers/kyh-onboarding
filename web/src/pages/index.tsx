import { useEffect, useState } from 'react';
import Head from 'next/head';
import ErrorPage from 'next/error';
import Confetti from 'react-confetti';
import Header from '../components/Header';
import TopicsProgress from '../components/TopicsProgress';
import TopicsGrid from '../components/TopicsGrid';
import LoadingPage from '../components/LoadingPage';
import { useContent, useUserDispatch, useUserState } from '../contexts';

export default function TopicsPage() {
  const user = useUserState();
  const userDispatch = useUserDispatch();
  const { topics, status, error } = useContent();
  const [readTopics, setReadTopics] = useState([]);
  const [unreadTopics, setUnreadTopics] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const read = [];
    const unread = [];

    topics.forEach((topic) => {
      user.readTopics.includes(topic._id)
        ? read.push(topic)
        : unread.push(topic);
    });

    setReadTopics(read);
    setUnreadTopics(unread);
  }, [user, topics]);

  useEffect(() => {
    if (
      readTopics.length &&
      !unreadTopics.length &&
      !user?.completedOnboarding
    ) {
      setShowConfetti(true);
      userDispatch({ type: 'COMPLETED_ONBOARDING' });
    }
  }, [user, unreadTopics, readTopics]);

  return (
    <>
      <Head>
        <title>Ämnen | KYH Onboarding</title>
      </Head>
      {showConfetti && (
        <Confetti
          className="motion-reduce:hidden"
          colors={['#ff0000', '#0000ff', '#ff6205', '#00df62']}
          opacity={0.7}
          recycle={false}
          onConfettiComplete={() => setShowConfetti(false)}
        />
      )}
      <Header isDarkBackground={false} />
      <main className="p-4 container mx-auto z-10 relative">
        <h1 className="sr-only">Ämnen</h1>
        {(status === 'idle' || status === 'loading') && (
          <div className="fixed top-0 left-0 w-full">
            <LoadingPage />
          </div>
        )}
        {status === 'error' && (
          <div className="fixed top-0 left-0 w-full">
            <ErrorPage statusCode={error?.code} title={error.message} />
          </div>
        )}
        {status === 'success' && (
          <>
            <TopicsProgress
              readTopics={readTopics.length}
              totalTopics={topics.length}
            />
            {!topics.length && (
              <>
                <h2 className="text-2xl mt-8 sm:mt-12 mb-2">Alla ämnen</h2>
                <p>Tyvärr, inga ämnen hittades för din utbildning.</p>
              </>
            )}
            {unreadTopics.length > 0 && (
              <>
                <h2 className="text-2xl mt-8 sm:mt-12 mb-2">Olästa ämnen</h2>
                <TopicsGrid topics={unreadTopics} isRead={false} />
              </>
            )}
            {readTopics.length > 0 && (
              <>
                <h2 className="text-2xl mt-8 sm:mt-12 mb-2">Lästa ämnen</h2>
                <TopicsGrid topics={readTopics} isRead={true} />
              </>
            )}
          </>
        )}
      </main>
    </>
  );
}