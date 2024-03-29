import { useContent } from '../contexts';

type TopicsProgressProps = {
  readTopics: number;
  totalTopics: number;
};

const TopicsProgress = ({ readTopics, totalTopics }: TopicsProgressProps) => {
  const { program } = useContent();

  return (
    <div className="bg-gray-200 p-4 rounded flex flex-col items-center">
      <>
        {readTopics === 0 && (
          <p className="font-normal my-2">
            Nedan hittar du olika ämnen med information om{' '}
            <span className="font-semibold">{program?.title}</span> programmet
            du kommer läsa i{' '}
            <span className="font-semibold">{program?.location?.title}</span>.
            Vi rekommenderar att du läser igenom allihopa (
            <span role="img" aria-label="nerd face emoji">
              🤓
            </span>
            ). Klicka på ett ämne för att köra igång{' '}
            <span role="img" aria-label="hand pointing down emoji">
              👇
            </span>
          </p>
        )}

        {readTopics !== 0 && readTopics < totalTopics && (
          <p className="font-normal my-2">
            {totalTopics - readTopics}{' '}
            {readTopics === totalTopics - 1 ? 'ämne' : 'ämnen'} kvar{' '}
            <span role="img" aria-label="books emoji">
              📚
            </span>
          </p>
        )}

        {totalTopics !== 0 && readTopics === totalTopics && (
          <p className="font-normal my-2">
            Bra jobbat med att läsa alla ämnen!{' '}
            <span role="img" aria-label="clap emoji">
              👏
            </span>{' '}
            Du är klar med onboarding och härnäst väntar uppstarten! Alla ämnen
            kommer finnas kvar om du skulle vilja komma tillbaka och läsa något
            igen. Om du fortfarande har frågor är du så klart välkommen att höra
            av dig till din utbildningsledare genom{' '}
            <a
              className="font-semibold focus:outline-none hover:underline focus-visible:underline decoration-orange decoration-[0.1rem] underline-offset-4"
              href={`mailto:${program?.email}`}
            >
              {program?.email}
            </a>
            . Vi ses i klassrummet!{' '}
            <span role="img" aria-label="victory hand emoji">
              ✌️
            </span>
          </p>
        )}
      </>
      {/* TODO: a11y of progress bar */}
      {readTopics !== 0 && (
        <div className="relative h-4 w-full">
          <span className="absolute w-full text-center z-10 text-xs font-semibold leading-4 text-white">
            {readTopics} / {totalTopics}
          </span>

          <div className="absolute w-full h-full bg-gray-400 rounded" />
          <div
            className="absolute h-full rounded bg-gray-900"
            style={{ width: `${(readTopics / totalTopics) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default TopicsProgress;
