import { MdDashboard } from 'react-icons/md';

export default {
  name: 'topic',
  title: 'Topic',
  type: 'document',
  icon: MdDashboard,
  initialValue: {
    options: {
      _type: 'object',
      showCSN: false,
      showClassCodes: false,
    },
  },
  fields: [
    {
      name: 'order',
      title: 'Order',
      type: 'number',
      hidden: true,
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => [
        Rule.required().min(1).error('Title is required'),
        Rule.max(100).warning('Shorter titles are usually better'),
      ],
    },
    {
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Numbered', value: 'number' },
            { title: 'Bullet', value: 'bullet' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                  },
                ],
              },
            ],
          },
        },
        { type: 'figure' },
        { type: 'youtube' },
      ],
    },
    {
      name: 'options',
      title: 'Options',
      type: 'object',
      fields: [
        {
          name: 'showCSN',
          title: 'Show CSN table',
          description:
            'Inserts a table below the body with CSN application dates for the students program',
          type: 'boolean',
        },
        {
          name: 'showClassCodes',
          title: 'Show class codes table',
          description:
            'Inserts a table below the body with Google classroom codes for the students program',
          type: 'boolean',
        },
      ],
    },
    {
      name: 'questions',
      title: 'Questions',
      description: 'Add frequently asked question for this topic',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (Rule) => [
                Rule.required().min(1).error('Question is required'),
                Rule.max(100).warning('Shorter questions are usually better'),
              ],
            },
            {
              name: 'answer',
              title: 'Answer',
              type: 'array',
              of: [
                {
                  type: 'block',
                  styles: [
                    { title: 'Normal', value: 'normal' },
                    { title: 'H4', value: 'h4' },
                    { title: 'Quote', value: 'blockquote' },
                  ],
                  lists: [
                    { title: 'Numbered', value: 'number' },
                    { title: 'Bullet', value: 'bullet' },
                  ],
                  marks: {
                    decorators: [
                      { title: 'Strong', value: 'strong' },
                      { title: 'Emphasis', value: 'em' },
                      { title: 'Code', value: 'code' },
                    ],
                    annotations: [
                      {
                        title: 'URL',
                        name: 'link',
                        type: 'object',
                        fields: [
                          {
                            title: 'URL',
                            name: 'href',
                            type: 'url',
                          },
                        ],
                      },
                    ],
                  },
                },
                { type: 'figure' },
                { type: 'youtube' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'programs',
      title: 'Programs',
      description: 'Assign the programs relevant for this topic',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'program' } }],
      validation: (Rule) => [
        Rule.required().min(1).error('Assign a program'),
        Rule.unique().error('Program already assigned'),
      ],
    },
    {
      name: 'image',
      title: 'Cover image',
      type: 'image',
    },
  ],
  orderings: [
    {
      title: 'Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Title',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      image: 'image',
      programsCount: 'programs.length',
      program0: 'programs.0.title',
      program1: 'programs.1.title',
      program2: 'programs.2.title',
    },
    prepare: (selection) => {
      const {
        title,
        image,
        programsCount,
        program0,
        program1,
        program2,
      } = selection;

      const programs = [program0, program1, program2].filter(Boolean);
      const subtitle = programsCount
        ? `(${programsCount}) ${programs.join(', ')}`
        : 'No assigned programs';

      return {
        title,
        subtitle: programsCount > programs.length ? `${subtitle}...` : subtitle,
        media: image,
      };
    },
  },
};
