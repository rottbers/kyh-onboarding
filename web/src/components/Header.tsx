import Link from 'next/link';
import { useRouter } from 'next/router';
import { MdMenu, MdClose } from 'react-icons/md';
import Logo from './Logo';

export default function Header({ isDarkBackground = false }) {
  const { pathname } = useRouter();

  return (
    <header
      className={`p-4 ${isDarkBackground ? 'text-white' : 'text-gray-900'}`}
    >
      <nav className="text-xl text-center font-mono fill-current relative z-50 flex justify-between items-center w-full">
        <div>
          <a
            className="focus-visible:ring focus:outline-none hover:text-orange"
            href="https://kyh.se"
          >
            <Logo aria-label="KYH" className="inline-block h-6" />
          </a>{' '}
          |{' '}
          <Link href="/">
            <a className="focus-visible:ring focus:outline-none hover:text-orange">
              Onboarding
            </a>
          </Link>
        </div>
        {pathname === '/setup' ? (
          <Link href="/">
            <a className="text-3xl focus-visible:ring focus:outline-none hover:text-orange">
              <MdClose aria-label="stäng inställningar" />
            </a>
          </Link>
        ) : (
          <Link href="/setup">
            <a className="text-3xl focus-visible:ring focus:outline-none hover:text-orange">
              {/* TODO: consider another icon */}
              <MdMenu aria-label="inställningar" />
            </a>
          </Link>
        )}
      </nav>
    </header>
  );
}
