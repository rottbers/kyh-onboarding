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
    {
      name: 'email',
      title: 'Contact email',
      type: 'email',
      validation: (Rule) => [Rule.required()],
    },
    {
      name: 'csn',
      title: 'CSN application dates',
      type: 'object',
      fields: [
        {
          name: 'firstSemester',
          title: 'First semester',
          type: 'object',
          fieldsets: [{ name: 'csn', options: { columns: 2 } }],
          fields: [
            {
              name: 'startDate',
              title: 'Start date',
              type: 'date',
              fieldset: 'csn',
              validation: (Rule) => [Rule.required()],
            },
            {
              name: 'endDate',
              title: 'End date',
              type: 'date',
              fieldset: 'csn',
              validation: (Rule) => [Rule.required()],
            },
            {
              name: 'weeks',
              title: 'Weeks',
              type: 'number',
              fieldset: 'csn',
              validation: (Rule) => [Rule.required()],
            },
            {
              name: 'points',
              title: 'YH points',
              type: 'number',
              fieldset: 'csn',
              validation: (Rule) => [Rule.required()],
            },
          ],
        },
        {
          name: 'secondSemester',
          title: 'Second semester',
          type: 'object',
          fieldsets: [{ name: 'csn', options: { columns: 2 } }],
          fields: [
            {
              name: 'startDate',
              title: 'Start date',
              type: 'date',
              fieldset: 'csn',
              validation: (Rule) => [Rule.required()],
            },
            {
              name: 'endDate',
              title: 'End date',
              type: 'date',
              fieldset: 'csn',
              validation: (Rule) => [Rule.required()],
            },
            {
              name: 'weeks',
              title: 'Weeks',
              type: 'number',
              fieldset: 'csn',
              validation: (Rule) => [Rule.required()],
            },
            {
              name: 'points',
              title: 'YH points',
              type: 'number',
              fieldset: 'csn',
              validation: (Rule) => [Rule.required()],
            },
          ],
        },
      ],
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
