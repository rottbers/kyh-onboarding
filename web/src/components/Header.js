import Link from 'next/link';
import Logo from './Logo';

import { useFirebase } from '../contexts/Firebase';

const Header = ({ isDarkBackground }) => {
  const { firebase, user } = useFirebase();

  return (
    <header className="flex flex-row justify-between items-center p-4">
      <nav
        className={`text-xl text-center font-mono fill-current ${
          isDarkBackground ? 'text-white' : 'text-gray-900'
        }`}
      >
        <a
          className="border-brand hover:border-b-2 focus:border-b-2 focus:outline-none"
          href="https://kyh.se"
        >
          <Logo className="inline-block h-6" />
        </a>{' '}
        |{' '}
        <Link href="/">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a className="border-brand hover:border-b-2 focus:border-b-2 focus:outline-none">
            Onboarding
          </a>
        </Link>
      </nav>
      {/* TODO: build user menu */}
      <button
        onClick={() => firebase.auth().signOut()}
        style={user?.photoURL && { backgroundImage: `url(${user.photoURL})` }}
        className={`h-12 w-12 rounded-full border-2 bg-center bg-cover bg-gray-200 hover:border-brand focus:border-brand focus:outline-none ${
          isDarkBackground ? 'border-white' : 'border-gray-900'
        }`}
      >
        <span className="sr-only">Sign out</span>
      </button>
    </header>
  );
};

export default Header;
