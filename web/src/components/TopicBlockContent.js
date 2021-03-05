import Image from 'next/image';
import getYouTubeId from 'get-youtube-id';
import BlockContent from '@sanity/block-content-to-react';

const TopicBlockContent = ({ blocks }) => {
  const serializers = {
    types: {
      // eslint-disable-next-line react/display-name
      figure: ({ node }) => {
        const { image, alt, caption } = node;
        return (
          <figure>
            <div
              style={{
                backgroundSize: 'cover',
                backgroundImage: `url(${image.asset.metadata.lqip})`,
              }}
            >
              <Image
                src={image.asset.url}
                alt={alt}
                width={image.asset.metadata.dimensions.width}
                height={image.asset.metadata.dimensions.height}
                layout="responsive"
              />
            </div>
            {caption && <figcaption>{caption}</figcaption>}
          </figure>
        );
      },
      // eslint-disable-next-line react/display-name
      youtube: ({ node }) => {
        const { url, caption } = node;
        const id = getYouTubeId(url);
        return (
          <figure>
            <div style={{ position: 'relative', paddingBottom: '56.25%' }}>
              <iframe
                style={{ position: 'absolute', width: '100%', height: '100%' }}
                title="YouTube embed"
                src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
                frameBorder="0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
            {caption && <figcaption>{caption}</figcaption>}
          </figure>
        );
      },
    },
  };

  return (
    <div className="topic-content">
      <BlockContent
        blocks={blocks}
        serializers={serializers}
        projectId="oo5ws9d6"
        dataset="production"
      />
    </div>
  );
};

export default TopicBlockContent;
