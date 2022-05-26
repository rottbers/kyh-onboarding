import { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import TopicBlockContent from './TopicBlockContent';

/** TODO: look into proper type for `value` */
type TopicQuestionProps = {
  id: string;
  question: string;
  answer: any;
};

const TopicQuestion = ({ question, answer, id }: TopicQuestionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <h3>
        <button
          className="flex flex-row items-baseline text-left w-full py-4 px-2 my-1 focus:outline-none focus-visible:bg-gray-50 hover:bg-gray-50 focus-visible:ring"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls={`question-body-${id}`}
          id={`question-heading-${id}`}
        >
          <span aria-hidden={true} className="mr-4 text-blue/70 text-sm">
            {isOpen ? <FaMinus /> : <FaPlus />}
          </span>
          <span className="text-gray-700">{question}</span>
        </button>
      </h3>
      <div
        className={`px-10 mt-2 ${isOpen ? '' : 'hidden'}`}
        aria-labelledby={`question-heading-${id}`}
        id={`question-body-${id}`}
        hidden={!isOpen}
      >
        <TopicBlockContent value={answer} />
      </div>
    </>
  );
};

/** TODO: look into proper type for `value` */
type TopicQuestionsProps = {
  questions: [
    {
      _key: string;
      question: string;
      answer: any;
    }
  ];
};

const TopicQuestions = ({ questions }: TopicQuestionsProps) => (
  <>
    {questions && (
      <>
        <h2 className="text-2xl mt-12 mb-2">Vanliga frågor</h2>
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
