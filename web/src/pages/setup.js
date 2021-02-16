import { useEffect, useState } from 'react';
import Head from 'next/head';
import router from 'next/router';

import Logo from '../components/Logo';
import Spinner from '../components/Spinner';

import { useFirebase } from '../contexts/Firebase';
import sanityClient from '../utils/sanityClient';

export default function SetupPage({ locations }) {
  const { firebase, user } = useFirebase();
  const [locationId, setLocationId] = useState(undefined);
  const [programId, setProgramId] = useState(undefined);
  const [availablePrograms, setAvailablePrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const locationIndex = locations.findIndex(({ _id }) => _id === locationId);

    setProgramId(undefined);
    setAvailablePrograms(locations[locationIndex]?.programs ?? []);
  }, [locationId, locations]);

  async function onSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      await firebase
        .firestore()
        .doc(`users/${user.uid}`)
        .update({ locationId, programId });

      router.push('/');
    } catch (error) {
      setIsError(error);
      setIsLoading(false);
    }
  }

  if (isLoading) return <Spinner fullscreen />;

  const isFirstVisit = !user?.locationId && !user?.programId;

  return (
    <>
      <Head>
        <title>Setup | KYH Onboarding</title>
      </Head>
      <main className="w-full min-h-screen flex flex-col sm:items-center md:justify-center p-4">
        <h1 className="text-3xl sm:text-4xl text-center mb-8">
          <Logo className="inline-block h-8 sm:h-10" /> | Onboarding
        </h1>
        {isFirstVisit ? (
          <>
            <p className="mb-2">
              Hey 👋! Hope you’re excited! We’re looking forward to have you at
              KYH starting this semester.
            </p>
            <p className="mb-2">
              We know you may have questions so we created this website to
              hopefully answer some of them.
            </p>
            <p className="mb-2">
              Now that you're signed in, select your location and program to
              start onboarding.
            </p>
          </>
        ) : (
          <p className="mb-2">
            Picked the wrong location or program? Don't worry, just update it
            below.
          </p>
        )}

        <form onSubmit={onSubmit} className="flex flex-col w-full md:w-96 mt-4">
          <label htmlFor="location" className="font-semibold mb-1">
            Location
          </label>
          <select
            className="mb-4 rounded-sm bg-transparent cursor-pointer border-gray-900"
            placeholder="Select location"
            name="location"
            id="location"
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
          >
            <option hidden value={undefined}>
              -
            </option>
            {locations &&
              locations.map((location) => (
                <option
                  className="text-gray-900"
                  key={location._id}
                  value={location._id}
                >
                  {location.title}
                </option>
              ))}
          </select>

          <label
            htmlFor="program"
            className={`font-semibold mb-1 ${
              !locationId || availablePrograms.length < 1 ? 'text-gray-400' : ''
            }`}
          >
            Program
          </label>
          <select
            disabled={!locationId || availablePrograms.length < 1}
            className="mb-4 rounded-sm bg-transparent cursor-pointer disabled:cursor-default disabled:text-gray-400 disabled:border-gray-400"
            placeholder="Select program"
            name="program"
            id="program"
            value={programId}
            onChange={(e) => setProgramId(e.target.value)}
          >
            <option hidden value={undefined}>
              -
            </option>
            {availablePrograms.map((program) => (
              <option
                className="text-gray-900 py-2"
                key={program._id}
                value={program._id}
              >
                {program.title}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={!locationId || !programId || isLoading}
            className="w-full mt-4 py-3 font-semibold bg-brand text-white border border-brand disabled:border-gray-400 disabled:bg-transparent disabled:text-gray-400 disabled:cursor-default rounded-sm focus:outline-none focus:ring"
          >
            {isFirstVisit ? 'Start onboarding ✌️' : 'Update'}
          </button>
          {isError && (
            <p
              className="mt-4 text-center text-brand-red font-normal"
              role="alert"
            >
              ✋ {isError?.message || 'Something went wrong'}
            </p>
          )}
        </form>
      </main>
    </>
  );
}

export async function getStaticProps() {
  const locations = await sanityClient.fetch(
    `*[_type == "location" && !(_id in path('drafts.**'))] {
      _id,
      title,
      "programs": programs[]-> {
        _id,
        title,
      }
    }`
  );

  return { props: { locations } };
}
