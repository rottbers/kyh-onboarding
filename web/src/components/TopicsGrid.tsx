import Link from 'next/link';
import type { Topic } from '../pages/api/content/[programId]';

type TopicCardProps = Pick<Topic, 'image' | 'title'> & {
  isRead: boolean;
};

const TopicCard = ({ title, image, isRead }: TopicCardProps) => (
  <div
    className={`w-full h-full rounded flex flex-col ${
      isRead
        ? 'bg-gray-900'
        : 'bg-white bg-gradient-to-br from-orange/70 to-red/70'
    }`}
  >
    <div className="h-60 relative">
      {image && (
        <>
          <div
            className="z-10 absolute top-0 left-0 w-full h-full rounded-t bg-center bg-cover"
            style={{ backgroundImage: `url(${image?.metadata?.lqip})` }}
          />
          <div
            className="z-20 absolute top-0 left-0 w-full h-full rounded-t bg-center bg-cover"
            style={{
              backgroundImage: `url(${image?.url}?auto=format&w=720&fit=max&q=70)`,
            }}
          />
          <div className="absolute z-20 left-0 top-0 h-full w-full rounded-t bg-gray-900 opacity-25" />
        </>
      )}
    </div>
    <h3 className="z-30 text-lg text-white p-4">{title}</h3>
  </div>
);

type TopicsGridProps = {
  topics: Topic[];
  isRead: boolean;
};

const TopicsGrid = ({ topics, isRead }: TopicsGridProps) => (
  <ul className="grid gap-4 auto-rows-auto md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
    {topics.map((topic) => (
      <li key={topic._id}>
        <Link href={`/topic/${topic._id}`}>
          <a className="block rounded shadow hover:shadow-lg focus:outline-none focus-visible:ring">
            <TopicCard
              title={topic.title}
              image={topic?.image}
              isRead={isRead}
            />
          </a>
        </Link>
      </li>
    ))}
  </ul>
);

export default TopicsGrid;
