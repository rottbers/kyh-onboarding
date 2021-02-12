import router from 'next/router';
import Head from 'next/head';
import '../fonts/index.css';
import '../styles/tailwind.css';

import { FirebaseProvider, useFirebase } from '../contexts/Firebase';

// TODO: ...
const RouteAuthorization = ({ children }) => {
  const { isLoading, isAuthenticated } = useFirebase();

  if (isLoading) return <p>Loading...</p>;
  if (!isAuthenticated && router.pathname !== '/signin') {
    router.push('/signin');
    return <p>Loading...</p>;
  }
  return children;
};

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,700"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        ></link>
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <FirebaseProvider>
        <RouteAuthorization>
          <Component {...pageProps} />
        </RouteAuthorization>
      </FirebaseProvider>
    </>
  );
}
