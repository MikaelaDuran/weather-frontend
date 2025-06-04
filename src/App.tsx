import './App.css'
import Weather from './components/Weather'
import weatherIcon from './assets/weather_liten.png';

function getLocalDate(): string {
  const date = new Date();
  const weekday = date.toLocaleDateString('sv-SE', { weekday: 'long' });
  const capitalizedWeekday = capitalizeFirstLetter(weekday);

  const day = date.toLocaleDateString('sv-SE', { day: 'numeric' });
  const month = date.toLocaleDateString('sv-SE', { month: 'long' });
  const year = date.toLocaleDateString('sv-SE', { year: 'numeric' });

  return `${capitalizedWeekday} ${day} ${month} ${year}`;
}

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


function App() {
  

  return (
    <>
    <Weather/>
    <div className ='w-[500px] h-[250px] bg-gradient-to-tr from-blue-900 to-white shadow-lg rounded-xl m-auto relative px-6 top-[10%]'>
      <div className = 'flex justify-between w-full'>
        <div className='w-1/2 my-4 mx-auto flex justify-between items-center'>
      

        <div className='flex flex-col items-start justify-between h-full'>
          <p className='text xl'>{getLocalDate()}</p>
          <h1 className='mt-2 text-6xl font-semibold'>18 °C</h1>
        </div>
        </div>
        <div className='w-1/2 flex flex-col justify-between items-end'>
        <div className='relative'>
          <img src={weatherIcon} alt="Bild" />
          </div>
          <div className='flex flex-col justify-evenly gap-y-2 my-4 mx-auto text-xs'>
          <div className='flex justify-between gap-x-8'>
            <p>Air Pressure:</p>
            <p className='font-bold w-20'>10 km/h</p>
          </div>
          <div className='flex justify-between gap-x-8'>
            <p>Humidity:</p>
            <p className='font-bold w-20'>50 %</p>
          </div>
          </div>
          </div>
      </div>
    </div>

   
    </>
  )
}

export default App
