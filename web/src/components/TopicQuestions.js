import { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import TopicBlockContent from './TopicBlockContent';

const TopicQuestion = ({ questionHeading, answerBody }) => {
  const [open, setOpen] = useState(false);

  // TODO: improve click area, styles and a11y
  return (
    <div className="my-4">
      <div className="flex flex-row">
        <button
          className="mr-4 text-brand-blue focus:ring-2 focus:outline-none"
          onClick={() => setOpen(!open)}
        >
          {open ? <FaMinus /> : <FaPlus />}
          <span className="sr-only">{open ? 'Hide' : 'Show'} answer</span>
        </button>
        <h3 className="text-lg">{questionHeading}</h3>
      </div>
      <div className={`px-8 ${open ? '' : 'hidden'}`}>
        <TopicBlockContent blocks={answerBody} />
      </div>
    </div>
  );
};

const TopicQuestions = ({ questions }) => (
  <>
    {questions && (
      <>
        <h2 className="text-2xl mt-12 mb-1">Frequently asked questions</h2>
        {questions.map(({ _key, question, answer }) => (
          <TopicQuestion
            key={_key}
            questionHeading={question}
            answerBody={answer}
          />
        ))}
      </>
    )}
  </>
);

export default TopicQuestions;
