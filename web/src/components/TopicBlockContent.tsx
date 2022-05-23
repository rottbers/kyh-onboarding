/* eslint-disable react/display-name */
import Image from 'next/image';
import getYouTubeId from 'get-youtube-id';
import { PortableText } from '@portabletext/react';

export default function TopicBlockContent({ blocks }) {
  return (
    <div className="topic-content">
      <PortableText
        value={blocks}
        components={{
          types: {
            // eslint-disable-next-line react/display-name
            figure: ({ value }) => {
              const { image, alt, caption } = value;
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
            youtube: ({ value }) => {
              const { url, caption } = value;
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
        }}
      />
    </div>
  );
}
