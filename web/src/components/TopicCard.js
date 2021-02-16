const TopicCard = ({ title, image, isRead }) => (
  <li
    className={`group w-full h-full rounded shadow hover:shadow-lg relative flex flex-col ${
      isRead
        ? 'bg-gray-800'
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
  </li>
);

export default TopicCard;
