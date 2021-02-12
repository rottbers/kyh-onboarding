import { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import BlockContent from '@sanity/block-content-to-react';

const TopicQuestion = ({ questionHeading, answerBody }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="my-4">
      <div className="flex flex-row cursor-pointer">
        <button
          className="mr-4 text-brand-blue focus:ring-2 focus:outline-none"
          onClick={() => setOpen(!open)}
        >
          {open ? <FaMinus /> : <FaPlus />}
          <span className="sr-only">{open ? 'Hide' : 'Show'} answer</span>
        </button>
        <h3 className="text-lg" onClick={() => setOpen(!open)}>
          {questionHeading}
        </h3>
      </div>
      <div className={`px-8 font-light ${open ? '' : 'hidden'}`}>
        <BlockContent blocks={answerBody} />
      </div>
    </div>
  );
};

export default TopicQuestion;
