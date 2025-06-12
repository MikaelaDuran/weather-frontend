import { useEffect, useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import WeatherChart from './components/WeatherChart';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

interface Weather {
  id: number;
  temp: number;
  pressure: number;
  humidity: number;
  timestamp?: string;
}

function App() {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [dailyDataRaw, setDailyDataRaw] = useState<Weather[]>([]);
  const [selected, setSelected] = useState<'temp' | 'humidity' | 'pressure'>('temp');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // 🕒 Starta med nuvarande tid (HH:mm)
  const [selectedTime, setSelectedTime] = useState<string>(() => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const fetchWeather = () => {
    fetch('http://localhost:8080/weather/all')
      .then((res) => res.json())
      .then((data: Weather[]) => {
        if (data.length > 0) {
          const sortedData = [...data].sort((a, b) =>
            new Date(a.timestamp ?? '').getTime() - new Date(b.timestamp ?? '').getTime()
          );

          const filtered = sortedData.filter(entry => {
            const entryDate = new Date(entry.timestamp ?? '').toLocaleDateString('sv-SE');
            const selectedLocalDate = new Date(selectedDate).toLocaleDateString('sv-SE');
            return entryDate === selectedLocalDate;
          });

          setDailyDataRaw(filtered);

          if (filtered.length > 0) {
            const targetDateTime = new Date(`${selectedDate}T${selectedTime}`);
            let closest = filtered[0];
            let minDiff = Math.abs(new Date(closest.timestamp!).getTime() - targetDateTime.getTime());

            for (const entry of filtered) {
              const entryTime = new Date(entry.timestamp!);
              const diff = Math.abs(entryTime.getTime() - targetDateTime.getTime());
              if (diff < minDiff) {
                closest = entry;
                minDiff = diff;
              }
            }

            setWeather(closest);
          } else {
            setWeather(null);
          }
        }
      })
      .catch((err) => console.error('Failed to fetch weather data:', err));
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 60000); // uppdatera varje minut
    return () => clearInterval(interval);
  }, [selectedDate, selectedTime]);

  const changeDay = (offset: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + offset);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const card = (title: string, value: string) => (
    <div className="bg-white shadow rounded-xl p-4 text-center">
      <p className="text-gray-600 text-sm">{title}</p>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );

  const weekday = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' });
  const monthDay = new Date(selectedDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-tr from-white via-white to-sky-100 text-black flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-4xl bg-white/60 rounded-2xl shadow-2xl p-6 mt-12 relative">

          {/* Pildatum */}
          <button onClick={() => changeDay(-1)} className="absolute left-32 top-15 text-3xl text-gray-400 hover:text-black">{'<'}</button>
          <button onClick={() => changeDay(1)} className="absolute right-32 top-15 text-2xl text-gray-400 hover:text-black">{'>'}</button>

          {/* Dag och datum */}
          <h2 className="text-3xl font-playfair text-slate-700 text-center mb-1">{weekday}</h2>
          <p className="text-center text-slate-600 text-lg mb-1">{monthDay}</p>
          <p className="text-center text-sm text-gray-500 mb-4"></p>

          {/* Kalender / Tidväljare */}
          <div className="min-h-[70px] flex items-center justify-center mb-6 mt">
            {showDatePicker ? (
              <div className="bg-white shadow rounded px-3 py-2 relative flex gap-4 items-center">
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="absolute top-1 right-1 text-gray-500 hover:text-black"
                >
                  <IoClose size={18} />
                </button>
                <div className="flex flex-col">
                  <label className="text-xs text-gray-600 mb-1">Datum</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs text-gray-600 mb-1">Tid</label>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  />
                </div>
              </div>
            ) : (
              <button onClick={() => setShowDatePicker(true)}>
                <FaRegCalendarAlt className="text-black text-xl" />
              </button>
            )}
          </div>

          {/* Väderkort */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {card('Temperature', weather ? `${weather.temp} °C` : '--')}
            {card('Humidity', weather ? `${weather.humidity} %` : '--')}
            {card('Pressure', weather ? `${weather.pressure} hPa` : '--')}
          </div>

          {/* Graf */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-center gap-4 mb-4">
              <button
                onClick={() => setSelected('temp')}
                className={`px-4 py-1 rounded-full border ${selected === 'temp' ? 'bg-gray-200 text-gray-400 border-gray-200' : 'border-gray-300 text-gray-400'}`}
              >
                Temperature
              </button>
              <button
                onClick={() => setSelected('humidity')}
                className={`px-4 py-1 rounded-full border ${selected === 'humidity' ? 'bg-gray-200 text-gray-400 border-gray-200' : 'border-gray-300 text-gray-400'}`}
              >
                Humidity
              </button>
              <button
                onClick={() => setSelected('pressure')}
                className={`px-4 py-1 rounded-full border ${selected === 'pressure' ? 'bg-gray-200 text-gray-400 border-gray-200' : 'border-gray-300 text-gray-400'}`}
              >
                Pressure
              </button>
            </div>
            <WeatherChart dailyDataRaw={dailyDataRaw} selected={selected} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
