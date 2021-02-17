import React from 'react';
import getYouTubeId from 'get-youtube-id';

export default {
  name: 'youtube',
  title: 'YouTube embed',
  type: 'object',
  fields: [
    {
      name: 'url',
      title: 'YouTube video URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: "Leave blank if you don't want a caption",
    },
  ],
  preview: {
    select: {
      url: 'url',
      caption: 'caption',
    },
    // eslint-disable-next-line react/display-name
    component: ({ value }) => {
      const { url, caption } = value;
      const id = getYouTubeId(url);

      // TODO: look into why block isn't dragable in studio
      return (
        <figure>
          <div style={{ position: 'relative', paddingBottom: '56.25%' }}>
            <iframe
              style={{ position: 'absolute', width: '100%', height: '100%' }}
              title="YouTube embed"
              src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
              frameBorder="0"
              allowFullScreen
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
