import { useEffect, useState } from 'react';
import router from 'next/router';
import Head from 'next/head';
import { FaGoogle } from 'react-icons/fa';

import LoadingPage from '../components/LoadingPage';
import Logo from '../components/Logo';

import { useFirebase } from '../contexts/Firebase';

export default function SignInPage() {
  const { firebase } = useFirebase();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  function handleSignInRequest(e) {
    e.preventDefault();
    setIsLoading(true);
    setIsError(false);

    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    firebase.auth().useDeviceLanguage();
    firebase.auth().signInWithRedirect(provider);
  }

  useEffect(() => {
    async function handleSignInResponse() {
      setIsLoading(true);

      try {
        const { user } = await firebase.auth().getRedirectResult();
        if (!user) return setIsLoading(false);

        // TODO: validate email server side
        const isValidEmail = RegExp(/^.+?@.*?kyh.se$/gi).test(user.email);
        if (!isValidEmail) {
          firebase.auth().signOut();
          throw new Error(
            `${user.email} is unauthorized. Make sure you sign in using a @student.kyh.se account.`
          );
        }

        const userDocumentRef = firebase.firestore().doc(`users/${user.uid}`);
        const userDocument = await userDocumentRef.get();
        if (!userDocument.exists) await userDocumentRef.set({});

        const data = userDocument.data(); // TODO: check that programId and locationId still exists in CMS
        router.push(data?.programId && data?.locationId ? '/' : '/setup');
      } catch (error) {
        setIsError(error);
        setIsLoading(false);
      }
    }

    handleSignInResponse();
  }, [firebase]);

  if (isLoading) return <LoadingPage />;

  return (
    <>
      <Head>
        <title>Sign in | KYH Onboarding</title>
      </Head>
      <main className="w-full min-h-screen flex flex-col sm:items-center md:justify-center p-4">
        <h1 className="text-3xl sm:text-4xl text-center mb-8">
          <Logo className="inline-block h-8 sm:h-10" aria-label="KYH" /> |
          Onboarding
        </h1>
        <p className="text-center">
          Onboarding requires a <b>@student.kyh.se</b> Google account provided
          by faculty.
        </p>
        <form
          onSubmit={handleSignInRequest}
          className="flex flex-col w-full md:w-96 mt-4"
        >
          <button
            type="submit"
            disabled={isLoading}
            className="flex justify-center items-center w-full mt-4 py-3 font-semibold bg-orange text-white border border-orange disabled:border-gray-400 disabled:bg-transparent disabled:text-gray-400 disabled:cursor-default rounded-sm focus:outline-none focus:ring"
          >
            <span className="not-sr-only mr-1">
              <FaGoogle />
            </span>{' '}
            Sign in with Google
          </button>
          {isError && (
            <p className="mt-4 text-center text-red font-normal" role="alert">
              <span role="img" aria-label="hand emoji">
                ✋
              </span>{' '}
              {isError?.message || 'Something went wrong'}
            </p>
          )}
        </form>
      </main>
    </>
  );
}
