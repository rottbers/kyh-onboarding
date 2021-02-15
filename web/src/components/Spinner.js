const Spinner = ({ fullscreen = false }) => {
  // TODO: replace paragraph with spinner
  const Svg = () => <p role="status">Loading...</p>;

  return fullscreen ? (
    <main className="h-screen flex items-center justify-center">
      <Svg />
    </main>
  ) : (
    <Svg />
  );
};

export default Spinner;
