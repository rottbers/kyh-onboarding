import { MdSchool } from 'react-icons/md';

export default {
  name: 'program',
  title: 'Program',
  type: 'document',
  icon: MdSchool,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => [Rule.required().min(1).error('Title is required')],
    },
  ],
};
