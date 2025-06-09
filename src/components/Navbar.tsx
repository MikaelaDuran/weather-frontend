import cloudy from '../assets/cloudy.png'; // Adjust the path as necessary
import rainy from '../assets/rainy.png'; // Adjust the path as necessary

function Navbar() {
  return (
    <nav className="w-full bg-white shadow-md py-4">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-center items-center">
          <img
            src={cloudy}
            alt="Logo"
            className="h-20 w-aut0"
          />
        <span className="text-3xl font-semibold text-slate-500 drop-shadow-[2px_2px_2px_rgba(51,65,85,0.3)]">
        Weather
        </span>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
