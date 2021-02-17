import { MdDashboard } from 'react-icons/md';

// TODO: figure out input and data structure for assigning locations & programs
// this is required to filter relevant topics to the user client side
export default {
  name: 'topic',
  title: 'Topic',
  type: 'document',
  icon: MdDashboard,
  fields: [
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
      name: 'image',
      title: 'Cover image',
      type: 'image',
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
  ],
};
