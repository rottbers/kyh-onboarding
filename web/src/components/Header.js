import { useState } from 'react';
import Link from 'next/link';
import { MdMenu, MdClose } from 'react-icons/md';
import Logo from './Logo';
import { useFirebase } from '../contexts/Firebase';
import { useContent } from '../contexts/Content';

const Header = ({ isDarkBackground }) => {
  const { firebase, user } = useFirebase();
  const { program } = useContent();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header
      className={`flex flex-row justify-between items-center p-4 ${
        isDarkBackground && !isOpen ? 'text-white' : 'text-gray-900'
      }`}
    >
      <nav className={`text-xl text-center font-mono fill-current z-50`}>
        <a
          className="border-b-2 border-transparent hover:border-orange focus:border-orange focus:outline-none"
          href="https://kyh.se"
        >
          <Logo aria-label="KYH" className="inline-block h-6" />
        </a>{' '}
        |{' '}
        <Link href="/">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a className="border-b-2 border-transparent hover:border-orange focus:border-orange focus:outline-none">
            Onboarding
          </a>
        </Link>
      </nav>
      {/* TODO: a11y! */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-4xl z-50 focus:outline-none border-b-2 border-transparent focus:border-orange hover:border-orange"
      >
        {isOpen ? <MdClose /> : <MdMenu />}
      </button>
      <div
        className={`transition-opacity fixed left-0 top-0 z-40 min-h-full w-full bg-white py-12 px-4 flex flex-col items-center justify-center ${
          isOpen ? 'opacity-100' : 'w-0 h-0 opacity-0 invisible'
        }`}
      >
        <img
          src={user?.photoURL}
          alt="avatar"
          className="mb-4 h-16 w-16 md:h-32 md:w-32 rounded-full bg-center bg-cover bg-gray-200"
        />
        <p className="text-gray-700">{user?.displayName}</p>
        <p className="text-gray-700 mb-4">{user?.email}</p>
        {program?.title && program?.location?.title && (
          <p className="text-gray-700 mb-8 italic">
            {program.title}, {program.location.title}
          </p>
        )}
        <Link href="/setup">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a className="mb-8 font-normal text-xl focus:outline-none focus:underline focus:underline-orange hover:underline hover:underline-orange">
            Uppdatera ort eller utbildning
          </a>
        </Link>
        <button
          className="font-normal text-xl focus:outline-none focus:underline focus:underline-orange hover:underline hover:underline-orange"
          onClick={() => firebase.auth().signOut()}
        >
          Logga ut
        </button>
      </div>
    </header>
  );
};

export default Header;
