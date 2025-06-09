function Navbar() {
  return (
    <nav className="w-full bg-gradient-to-tr from-white via-white to-sky-100 backdrop-blur-md shadow-md py-4">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-center items-center gap-3">
          <span className="text-4xl font-baskervville text-gray-500 drop-shadow-[3px_3px_3px_rgba(51,65,85,0.3)]">
            Weather
          </span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
