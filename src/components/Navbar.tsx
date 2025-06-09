function Navbar() {
  return (
    <nav className="w-full bg-white shadow-md py-4">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-center items-center">
          <img
            src="/components/Logo.png" //Logga
            alt="Logo"
            className="h-10"
          />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
