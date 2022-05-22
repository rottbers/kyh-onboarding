import { AppProps } from 'next/app';
import Head from 'next/head';
import '../fonts/index.css';
import '../styles/tailwind.css';
import { ContentProvider, UserProvider } from '../contexts';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
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
      </Head>
      <UserProvider>
        <ContentProvider>
          <Component {...pageProps} />
        </ContentProvider>
      </UserProvider>
    </>
  );
}
