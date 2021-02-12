import { useEffect, useState } from 'react';
import router from 'next/router';
import Head from 'next/head';

import Logo from '../components/Logo';

import { useFirebase } from '../contexts/Firebase';

export default function SignInPage() {
  const { isAuthenticated, isLoading, user, firebase } = useFirebase();
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(user?.programId && user?.locationId ? '/' : '/setup');
    }
  }, [isLoading, isAuthenticated, user, router]);

  // TODO: ...
  async function onSubmit(e) {
    e.preventDefault();

    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ login_hint: email });

    await firebase.auth().signInWithRedirect(provider);
  }

  const isValidEmail = RegExp(/^.+?@student.kyh.se$/gim).test(email);

  return (
    <>
      <Head>
        <title>Sign in | KYH Onboarding</title>
      </Head>
      <main className="w-full min-h-screen flex flex-col sm:items-center md:justify-center p-4">
        <h1 className="text-3xl sm:text-4xl text-center mb-8">
          <Logo className="inline-block h-8 sm:h-10" /> | Onboarding
        </h1>
        <form onSubmit={onSubmit} className="flex flex-col w-full md:w-96 mt-4">
          <label htmlFor="email" className="font-semibold mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="jane.doe@student.kyh.se"
            className="mb-4 rounded-sm bg-transparent border-gray-900"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            disabled={!isValidEmail}
            className="w-full mt-4 py-3 font-semibold bg-brand text-white border border-brand disabled:border-gray-400 disabled:bg-transparent disabled:text-gray-400 disabled:cursor-default rounded-sm focus:outline-none focus:ring"
          >
            Sign in
          </button>
        </form>
      </main>
    </>
  );
}
