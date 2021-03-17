import Link from 'next/link';

// TODO: make card look good
const TopicCard = ({ title, image, isRead }) => (
  <div
    className={`w-full h-full rounded flex flex-col ${
      isRead
        ? 'bg-gray-900'
        : 'bg-white bg-gradient-to-br from-orange-opacity-70 to-red-opacity-70'
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
              backgroundImage: `url(${image?.url}?auto=format&max-w=720&q=50)`,
            }}
          />
          <div className="absolute z-20 left-0 top-0 h-full w-full rounded-t bg-gray-900 opacity-25" />
        </>
      )}
    </div>
    <h3 className="z-30 text-lg text-white p-4">{title}</h3>
  </div>
);

const TopicsGrid = ({ topics, isRead }) => (
  <ul className="grid gap-4 auto-rows-auto md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
    {topics.map((topic) => (
      <li
        key={topic._id}
        className="rounded shadow hover:shadow-lg focus-within:ring"
      >
        <Link href={`/topic/${topic._id}`}>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a className="focus:outline-none">
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
