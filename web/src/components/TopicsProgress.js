const TopicsProgress = ({
  readTopics,
  totalTopics,
  programEmail,
  programTitle,
  locationTitle,
}) => (
  <div className="bg-gray-200 p-4 rounded flex flex-col items-center">
    <>
      {readTopics === 0 && (
        <p className="font-normal my-2">
          Below you&apos;ll find various topics with information about the{' '}
          <span className="font-semibold">{programTitle}</span> program
          you&apos;ll be studying in{' '}
          <span className="font-semibold">{locationTitle}</span>. We suggest you
          read through all of them (
          <span role="img" aria-label="nerd face emoji">
            🤓
          </span>
          ). Pick a topic below to get started{' '}
          <span role="img" aria-label="hand pointing down emoji">
            👇
          </span>
        </p>
      )}

      {readTopics !== 0 && readTopics < totalTopics && (
        <p className="font-normal my-2">
          {totalTopics - readTopics}{' '}
          {readTopics === totalTopics - 1 ? 'topic' : 'topics'} left{' '}
          <span role="img" aria-label="books emoji">
            📚
          </span>
        </p>
      )}

      {readTopics === totalTopics && (
        <p className="font-normal my-2">
          Good job going through all the topics!{' '}
          <span role="img" aria-label="clap emoji">
            👏
          </span>{' '}
          You&apos;re done with onboarding and now the classroom awaits! The
          topics will remain available so you can always come back and revisit
          the information later. In case you still have questions then
          you&apos;re welcome to to get in contact with your program lead via{' '}
          <a
            className="font-semibold focus:outline-none hover:underline focus:underline hover:underline-orange focus:underline-orange"
            href={`mailto:${programEmail}`}
          >
            {programEmail}
          </a>
          . See you around!{' '}
          <span role="img" aria-label="victory hand emoji">
            ✌️
          </span>
        </p>
      )}
    </>
    {readTopics !== 0 && (
      <div className="relative h-4 w-full">
        <span className="absolute w-full text-center z-10 text-xs font-semibold leading-4 text-white">
          {readTopics} / {totalTopics}
        </span>

        <div className="absolute w-full h-full bg-gray-400 rounded" />
        <div
          className="absolute h-full rounded bg-gray-900"
          style={{ width: `${(readTopics / totalTopics) * 100}%` }}
        />
      </div>
    )}
  </div>
);

export default TopicsProgress;
