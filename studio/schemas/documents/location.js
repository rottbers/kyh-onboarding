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
      type: 'string',
      validation: (Rule) => [Rule.required().min(1).error('Title is required')],
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'icon',
    },
  },
};
