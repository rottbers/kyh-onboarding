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
    {
      name: 'location',
      title: 'Location',
      type: 'reference',
      to: { type: 'location' },
      validation: (Rule) => [Rule.required()],
    },
  ],
  preview: {
    select: {
      title: 'title',
      location: 'location.title',
    },
    prepare: (selection) => {
      const { title, location } = selection;
      return {
        title,
        subtitle: location ? location : 'No assigned location',
      };
    },
  },
};
