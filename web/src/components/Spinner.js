import Logo from "./Logo";

const Spinner = ({ fullscreen = false }) => {
  // TODO: replace paragraph with spinner
  return fullscreen ? (
    <main className="h-screen flex items-center justify-center flex-col">
      <Logo className="w-32 h-32 animate-bounce" />
      <p className="border-solid divide-y divide-black">LOADING</p>
    </main>
  ) : (
    <Logo />
  );
};

export default Spinner;
