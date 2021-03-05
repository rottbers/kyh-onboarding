import React from 'react';

export default {
  title: 'Image',
  name: 'figure',
  type: 'object',
  fields: [
    {
      title: 'Image',
      name: 'image',
      type: 'image',
      validation: (Rule) => Rule.required(),
    },
    {
      title: 'Alternative text',
      name: 'alt',
      type: 'string',
      description: 'A short description of the image',
      validation: (Rule) => Rule.required(),
    },
    {
      title: 'Caption',
      name: 'caption',
      type: 'string',
      description: "Leave blank if you don't want a caption",
    },
  ],
  preview: {
    select: {
      imageURL: 'image.asset.url',
      originalFilename: 'image.asset.originalFilename',
      alt: 'alt',
      caption: 'caption',
    },
    // eslint-disable-next-line react/display-name
    component: ({ value }) => {
      if (!value) return <div>Loading...</div>;

      const { originalFilename, imageURL, alt, caption } = value;

      return (
        <figure>
          <p style={{ fontWeight: 'bold' }}>{originalFilename}</p>
          <div style={{ position: 'relative', paddingBottom: '56.25%' }}>
            <img
              style={{ position: 'absolute', width: '100%', height: '100%' }}
              alt={alt}
              src={imageURL}
            />
          </div>
          {caption && (
            <figcaption style={{ textAlign: 'center', paddingTop: '1rem' }}>
              {caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};
