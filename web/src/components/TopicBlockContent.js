import Image from 'next/image';
import getYouTubeId from 'get-youtube-id';
import BlockContent from '@sanity/block-content-to-react';
import { projectId, dataset } from '../utils/sanity';

const TopicBlockContent = ({ blocks }) => {
  const serializers = {
    types: {
      // eslint-disable-next-line react/display-name
      figure: ({ node }) => {
        const { image, alt, caption } = node;
        return (
          <figure>
            <div className="bg-cover">
              <Image
                src={image.asset.url}
                alt={alt}
                width={image.asset.metadata.dimensions.width}
                height={image.asset.metadata.dimensions.height}
                layout="responsive"
                placeholder="blur"
                blurDataURL={image.asset.metadata.lqip}
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
            <div className="aspect-w-16 aspect-h-9">
              <iframe
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
        projectId={projectId}
        dataset={dataset}
      />
    </div>
  );
};

export default TopicBlockContent;
