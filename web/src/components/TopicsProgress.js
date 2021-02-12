const TopicsProgress = ({ readTopics, totalTopics }) => {
  const message = (() => {
    if (readTopics === 0)
      return "Below you'll find various topics with practical information about the program you'll be studying and its location. We suggest you read through all of them (🤓). Pick a topic below to get started 👇";
    if (readTopics === totalTopics - 1) return '1 topic left 📚';
    if (readTopics < totalTopics)
      return `${totalTopics - readTopics} topics left 📚`;
    return 'All done 🎉';
  })();

  return (
    <div className="bg-gray-200 p-4 rounded flex flex-col items-center">
      <p className="font-normal my-2">{message}</p>
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
};

export default TopicsProgress;
