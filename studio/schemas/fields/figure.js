// TODO: ...

export default {
  title: 'Image',
  name: 'image',
  type: 'object',
  fields: [
    {
      title: 'Image',
      name: 'image',
      type: 'image',
    },
    {
      title: 'Alternative text',
      name: 'alt',
      type: 'string',
      description: 'A short description of the image for a11y',
      validation: (Rule) => Rule.required(),
    },
    {
      title: 'Caption',
      name: 'caption',
      type: 'string',
      description: "Leave blank if you don't want a caption",
    },
  ],
};
