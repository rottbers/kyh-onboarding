import { MdLocationOn } from 'react-icons/md';

export default {
  name: 'location',
  title: 'Location',
  type: 'document',
  icon: MdLocationOn,
  fields: [
    {
      name: 'title',
      title: 'Title',
      description: '...',
      type: 'string',
      validation: (Rule) => [Rule.required().min(1).error('Title is required')],
    },
    {
      name: 'programs',
      title: 'Programs',
      description: 'Assign the programs available at this location',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'program' } }],
      validation: (Rule) => [
        Rule.required().min(1).error('Assign a program'),
        Rule.unique().error('Program already assigned'),
      ],
    },
  ],
};
