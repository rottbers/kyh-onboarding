import Logo from './Logo';

const LoadingPage = () => (
  <main className="h-screen flex flex-col items-center justify-center">
    <Logo className="w-32 h-32 animate-pulse" aria-label="KYH" />
    <p className="sr-only" role="status">
      Laddar
    </p>
  </main>
);

export default LoadingPage;
