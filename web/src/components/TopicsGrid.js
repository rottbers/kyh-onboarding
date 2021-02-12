import Link from 'next/link';
import TopicCard from './TopicCard';

const TopicsGrid = ({ topics, isRead }) => (
  <ul className="grid gap-4 auto-rows-auto md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
    {topics.map((topic) => (
      <Link key={topic._id} href={`/topic/${topic._id}`}>
        <a className="rounded focus:outline-none focus:ring">
          <TopicCard title={topic.title} image={topic?.image} isRead={isRead} />
        </a>
      </Link>
    ))}
  </ul>
);

export default TopicsGrid;
