import { useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import router from 'next/router';
import Header from '../components/Header';
import Logo from '../components/Logo';
import { useUserDispatch, useUserState } from '../contexts';
import { sanityClient } from '../utils/sanity';

export default function SetupPage({ locations, programs }) {
  const user = useUserState();
  const dispatch = useUserDispatch();
  const [locationId, setLocationId] = useState('');
  const [programId, setProgramId] = useState('');
  const [isFirstVisit] = useState(!user.programId);

  const availablePrograms = useMemo(() => programs.filter((p) => p.locationId === locationId), [locationId, programs]); // prettier-ignore
  const isInvalidProgramId = !isFirstVisit && !programs.some((p) => p._id === user?.programId); // prettier-ignore

  useEffect(() => {
    if (user.programId) {
      setProgramId(user.programId);
      setLocationId(programs.find((p) => p._id === user.programId)?.locationId);
    }
  }, [user, programs]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    dispatch({ type: 'SETUP', data: { programId } });
    router.push('/');
  }

  function Form() {
    return (
      <form onSubmit={onSubmit} className="flex flex-col w-full md:w-96 mt-4">
        <label htmlFor="location" className="font-semibold mb-1">
          Ort
        </label>
        <select
          className="mb-4 rounded-sm bg-transparent cursor-pointer focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-50"
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
          className="mb-4 rounded-sm bg-transparent cursor-pointer focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-50 disabled:cursor-default disabled:text-gray-400 disabled:border-gray-400"
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
          className="w-full mt-4 py-3 font-semibold bg-orange text-white border border-orange disabled:border-gray-400 disabled:bg-transparent disabled:text-gray-400 disabled:cursor-default rounded-sm focus:outline-none focus-visible:ring hover:bg-orange/90 hover:border-orange/90"
        >
          {isFirstVisit ? 'Starta onboarding ✌️' : 'Uppdatera'}
        </button>
      </form>
    );
  }

  if (isFirstVisit) {
    return (
      <>
        <Head>
          <title>Välj utbildning | KYH Onboarding</title>
        </Head>
        <main className="w-full min-h-screen flex flex-col sm:items-center md:justify-center p-4">
          <h1 className="text-3xl text-center mb-8">
            <Logo className="inline-block h-8 sm:h-10" aria-label="KYH" /> |
            Onboarding
          </h1>
          <p className="mb-2 text-gray-700">
            Hej!{' '}
            <span role="img" aria-label="wave emoji">
              👋
            </span>{' '}
            Hoppas du är förväntansfull! Vi ser fram emot att ha dig som
            studerande hos oss på KYH.
          </p>
          <p className="mb-2 text-gray-700">
            Vi vet att nya studenter ofta har frågor vilket är varför den här
            sidan är framtagen för din skull.
          </p>
          <p className="mb-2 text-gray-700">
            Välj den ort & utbildning du blivit antagen till för att start
            onboarding.
          </p>
          <Form />
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Ändra inställningar | KYH Onboarding</title>
      </Head>
      <Header />
      <main className="w-full h-full flex flex-col sm:items-center md:justify-center p-4">
        <h1 className="text-3xl mb-8 md:mt-16">Ändra inställningar</h1>
        {isInvalidProgramId ? (
          <p className="mb-2 text-gray-700">
            Verkar som din utbildning inte längre finns i vårat system. Se om du
            kan hitta den nedan annars ta kontakt med KYH.
          </p>
        ) : (
          <p className="mb-2 text-gray-700">
            Valde du fel ort eller utbildning? Det är lugnt, bara att uppdatera
            ditt val nedan.
          </p>
        )}
        <Form />
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
