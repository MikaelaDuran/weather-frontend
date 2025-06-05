import React, { useEffect, useState } from 'react';
import './App.css';
import weatherIcon from './assets/weather_liten.png';

interface Weather {
  id: number;
  temp: number;
  pressure: number;
  humidity: number;
}

function App() {
  const [weather, setWeather] = useState<Weather | null>(null);
  
useEffect(() => {
  fetch('http://localhost:8080/weather/all')
    .then((res) => res.json())
    .then((data) => {
      if (data.length > 0) setWeather(data[0]);
    })
    .catch((err) => console.error('Kunde inte hämta väder:', err));
}, []);
function getLocalDate(): string {
  const date = new Date();
  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
  const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  const day = date.toLocaleDateString('en-US', { day: 'numeric' });
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const year = date.toLocaleDateString('en-US', { year: 'numeric' });
  return `${capitalizedWeekday} ${day} ${month} ${year}`;
}

  return (
    <div className="w-[500px] h-[250px] bg-gradient-to-tr from-blue-900 to-white shadow-lg rounded-xl m-auto  mt-20 relative px-6">
      <div className="flex justify-between w-full">
        <div className="w-1/2 my-4 mx-auto flex justify-between items-center">
          <div className="flex flex-col items-start justify-between h-full">
            <p className="text xl">{getLocalDate()}</p>
            <h1 className="mt-2 text-6xl font-semibold">
              {weather ? `${weather.temp} °C` : 'Laddar...'}
            </h1>
          </div>
        </div>

        <div className="w-1/2 flex flex-col justify-between items-end">
          <div className="relative">
            <img src={weatherIcon} alt="Icon" />
          </div>
          <div className="flex flex-col justify-evenly gap-y-2 my-4 mx-auto text-xs">
            <div className="flex justify-between gap-x-8">
              <p>Air Pressure:</p>
              <p className="font-bold w-20">{weather ? `${weather.pressure} hPa` : '...'}</p>
            </div>
            <div className="flex justify-between gap-x-8">
              <p>Humidity:</p>
              <p className="font-bold w-20">{weather ? `${weather.humidity} %` : '...'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
