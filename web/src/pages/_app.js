import Head from 'next/head';
import '../fonts/index.css';
import '../styles/tailwind.css';

import { FirebaseProvider, FirebaseAuthorization } from '../contexts/Firebase';
import { ContentProvider } from '../contexts/Content';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
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
        <title>KYH Onboarding</title>
        {/* TODO: consider making a setting in the CMS, fixed URL for now */}
        <meta
          property="og:image"
          content="https://kyh-onboarding.vercel.app/social.png"
        />
        <meta
          property="twitter:image"
          content="https://kyh-onboarding.vercel.app/social.png"
        />
        <meta property="twitter:card" content="summary_large_image" />
        <link rel="preconnect" href="https://www.googleapis.com" />
        <link rel="preconnect" href="https://firestore.googleapis.com" />
      </Head>
      <FirebaseProvider>
        <FirebaseAuthorization>
          <ContentProvider>
            <Component {...pageProps} />
          </ContentProvider>
        </FirebaseAuthorization>
      </FirebaseProvider>
    </>
  );
}
