import { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import TopicBlockContent from './TopicBlockContent';

const TopicQuestion = ({ question, answer, id }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <h3>
        <button
          className="flex flex-row items-baseline text-left w-full py-4 px-2 focus:outline-none focus:bg-gray-50 hover:bg-gray-50 focus:ring"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls={`question-body-${id}`}
          id={`question-heading-${id}`}
        >
          <span aria-hidden={true} className="mr-4 text-brand-blue">
            {isOpen ? <FaMinus /> : <FaPlus />}
          </span>
          <span className="text-lg">{question}</span>
        </button>
      </h3>
      <div
        className={`px-10 mt-2 ${isOpen ? '' : 'hidden'}`}
        aria-labelledby={`question-heading-${id}`}
        id={`question-body-${id}`}
        hidden={!isOpen}
      >
        <TopicBlockContent blocks={answer} />
      </div>
    </>
  );
};

const TopicQuestions = ({ questions }) => (
  <>
    {questions && (
      <>
        <h2 className="text-2xl mt-12 mb-2">Frequently asked questions</h2>
        {questions.map(({ _key, question, answer }) => (
          <TopicQuestion
            key={_key}
            id={_key}
            question={question}
            answer={answer}
          />
        ))}
      </>
    )}
  </>
);

export default TopicQuestions;
