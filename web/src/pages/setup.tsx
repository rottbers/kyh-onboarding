import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import router from 'next/router';
import Logo from '../components/Logo';
import { useUserDispatch, useUserState } from '../contexts';
import { sanityClient } from '../utils/sanity';

export default function SetupPage({ locations, programs }) {
  const user = useUserState();
  const dispatch = useUserDispatch();
  const [locationId, setLocationId] = useState('');
  const [programId, setProgramId] = useState('');

  const availablePrograms = useMemo(() => programs.filter((p) => p.locationId === locationId), [locationId]); // prettier-ignore
  const isFirstVisit = user.status === 'not-setup';
  const isInvalidProgramId = !isFirstVisit && !programs.some((p) => p._id === user?.programId); // prettier-ignore

  useEffect(() => {
    if (user.programId && !isFirstVisit) {
      setProgramId(user.programId);
      setLocationId(programs.find((p) => p._id === user.programId)?.locationId);
    }
  }, [user, isFirstVisit]);

  function onSubmit(e) {
    e.preventDefault();
    dispatch({ type: 'SETUP', data: { programId } });
    router.push('/');
  }

  return (
    <>
      <Head>
        <title>Välj utbildning | KYH Onboarding</title>
      </Head>
      <main className="w-full min-h-screen flex flex-col sm:items-center md:justify-center p-4">
        <h1 className="text-3xl sm:text-4xl text-center mb-8">
          <Logo className="inline-block h-8 sm:h-10" aria-label="KYH" /> |
          Onboarding
        </h1>
        {isFirstVisit ? (
          <>
            <p className="mb-2">
              Hej!{' '}
              <span role="img" aria-label="wave emoji">
                👋
              </span>{' '}
              Hoppas du är förväntansfull! Vi ser fram emot att ha dig som
              studerande hos oss på KYH.
            </p>
            <p className="mb-2">
              Vi vet att nya studenter ofta har frågor vilket är varför den här
              sidan är framtagen för din skull.
            </p>
            <p className="mb-2">
              Välj den ort & utbildning du blivit antagen till för att start
              onboarding.
            </p>
          </>
        ) : isInvalidProgramId ? (
          <p className="mb-2">
            Verkar som din utbildning inte längre finns i vårat system. Se om du
            kan hitta den nedan annars ta kontakt med KYH.
          </p>
        ) : (
          <p className="mb-2">
            Valde du fel ort eller utbildning för sidan? Det lugnt, bara att
            uppdatera ditt val nedan.
          </p>
        )}

        <form onSubmit={onSubmit} className="flex flex-col w-full md:w-96 mt-4">
          <label htmlFor="location" className="font-semibold mb-1">
            Ort
          </label>
          <select
            className="mb-4 rounded-sm bg-transparent cursor-pointer focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            placeholder="Select location"
            name="location"
            id="location"
            value={locationId}
            onChange={(e) => {
              setProgramId('');
              setLocationId(e.target.value);
            }}
          >
            <option hidden value="">
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
            Utbildning
          </label>
          <select
            disabled={!locationId || availablePrograms.length < 1}
            className="mb-4 rounded-sm bg-transparent cursor-pointer focus:ring focus:ring-blue-500 focus:ring-opacity-50 disabled:cursor-default disabled:text-gray-400 disabled:border-gray-400"
            placeholder="Select program"
            name="program"
            id="program"
            value={programId}
            onChange={(e) => setProgramId(e.target.value)}
          >
            <option hidden value="">
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
            disabled={!locationId || !programId}
            className="w-full mt-4 py-3 font-semibold bg-orange text-white border border-orange disabled:border-gray-400 disabled:bg-transparent disabled:text-gray-400 disabled:cursor-default rounded-sm focus:outline-none focus:ring"
          >
            {isFirstVisit ? 'Starta onboarding ✌️' : 'Uppdatera'}
          </button>
        </form>
      </main>
    </>
  );
}

export async function getStaticProps() {
  const { locations, programs } = await sanityClient.fetch(
    `{
      "locations": *[_type == "location" && !(_id in path('drafts.**'))] | order(title asc) {
        _id,
        title,
      },
      "programs": *[_type == "program" && !(_id in path('drafts.**'))] | order(title asc) {
        _id,
        title,
        "locationId": location._ref
      }
    }`
  );

  return { props: { locations, programs }, revalidate: 30 };
}
