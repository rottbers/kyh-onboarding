import Link from 'next/link';

const TopicCard = ({ title, image, isRead }) => (
  <div
    className={`group w-full h-full rounded shadow hover:shadow-lg focus:outline-none focus:ring relative flex flex-col ${
      isRead
        ? 'bg-gray-900'
        : 'bg-white bg-gradient-to-br from-brand-opacity-70 to-brand-red-opacity-70'
    }`}
  >
    <div
      className="w-full h-60 rounded-t bg-center bg-cover bg-no-repeat"
      style={image && { backgroundImage: `url(${image})` }}
    />
    <h3 className="text-lg text-white p-4 group-hover:underline mr-10">
      {title}
    </h3>
  </div>
);

const TopicsGrid = ({ topics, isRead }) => (
  <ul className="grid gap-4 auto-rows-auto md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
    {topics.map((topic) => (
      <li key={topic._id}>
        <Link href={`/topic/${topic._id}`}>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a>
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
