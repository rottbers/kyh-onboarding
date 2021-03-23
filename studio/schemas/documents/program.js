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
      name: 'classCodes',
      title: 'Google classroom codes',
      type: 'array',
      of: [
        {
          name: 'classCode',
          title: 'Google classroom code',
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Class name',
              type: 'string',
              validation: (Rule) => [Rule.required()],
            },
            {
              name: 'code',
              title: 'Class code',
              type: 'string',
              validation: (Rule) => [Rule.required()],
            },
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'code',
            },
          },
        },
      ],
    },
    {
      name: 'csn',
      title: 'CSN application dates',
      type: 'array',
      of: [
        {
          name: 'csnDate',
          title: 'CSN application date',
          type: 'object',
          fields: [
            {
              name: 'semester',
              title: 'Semester',
              type: 'string',
              validation: (Rule) => [Rule.required()],
            },
            {
              name: 'startDate',
              title: 'Start date',
              type: 'date',
              validation: (Rule) => [Rule.required()],
            },
            {
              name: 'endDate',
              title: 'End date',
              type: 'date',
              validation: (Rule) => [Rule.required()],
            },
            {
              name: 'weeks',
              title: 'Weeks',
              type: 'number',
              validation: (Rule) => [Rule.required()],
            },
            {
              name: 'points',
              title: 'YH points',
              type: 'number',
              validation: (Rule) => [Rule.required()],
            },
          ],
          preview: {
            select: {
              title: 'semester',
              startDate: 'startDate',
              endDate: 'endDate',
              weeks: 'weeks',
              points: 'points',
            },
            prepare: (selection) => {
              const { title, startDate, endDate, weeks, points } = selection;

              return {
                title,
                subtitle: `${startDate} - ${endDate}, ${weeks} weeks, ${points} YH points`,
              };
            },
          },
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
