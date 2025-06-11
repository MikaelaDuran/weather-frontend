import { useEffect, useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import WeatherChart from './components/WeatherChart';
import { IoCalendarOutline } from 'react-icons/io5'; // Ny ikon

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
            const entryDate = new Date(entry.timestamp ?? '').toISOString().split('T')[0];
            return entryDate === selectedDate;
          });

          setDailyDataRaw(filtered);
          setWeather(filtered[filtered.length - 1] ?? null);
        }
      })
      .catch((err) => console.error('Failed to fetch weather data:', err));
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 60000);
    return () => clearInterval(interval);
  }, [selectedDate]);

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
  const monthDay = new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-tr from-white via-white to-sky-100 text-black flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-4xl bg-white/60 rounded-2xl shadow-2xl p-6 mt-12 relative">

          <button onClick={() => changeDay(-1)} className="absolute left-32 top-15 text-2xl text-gray-400">{'<'}</button>
          <button onClick={() => changeDay(1)} className="absolute right-32 top-15 text-2xl text-gray-400">{'>'}</button>

          <h2 className="text-3xl font-playfair text-slate-700 text-center mb-1 mt-4">{weekday}</h2>

        <div className="flex flex-col items-center mb-6 relative">
          <p className="text-center text-slate-600 text-lg">{monthDay}</p>

          <div className="relative mt-2">
            <button onClick={() => setShowDatePicker(prev => !prev)}>
              <IoCalendarOutline className="text-black text-xl" />
            </button>

            {showDatePicker && (
              <div className="absolute top-7 left-1/2 -translate-x-1/2 z-10">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setShowDatePicker(false);
                  }}
                  className="text-black text-sm border border-gray-300 rounded px-2 py-1 bg-white shadow"
                />
              </div>
            )}
          </div>
        </div>


          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 mb-6">
            {card('Temperature', weather ? `${weather.temp} °C` : '--')}
            {card('Humidity', weather ? `${weather.humidity} %` : '--')}
            {card('Pressure', weather ? `${weather.pressure} hPa` : '--')}
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-center gap-4 mb-4">
              <button onClick={() => setSelected('temp')} className={`px-4 py-1 rounded-full border ${selected === 'temp' ? 'bg-gray-200 text-gray-400 border-gray-200' : 'border-gray-300 text-gray-400'}`}>Temperature</button>
              <button onClick={() => setSelected('humidity')} className={`px-4 py-1 rounded-full border ${selected === 'humidity' ? 'bg-gray-200 text-gray-400 border-gray-200' : 'border-gray-300 text-gray-400'}`}>Humidity</button>
              <button onClick={() => setSelected('pressure')} className={`px-4 py-1 rounded-full border ${selected === 'pressure' ? 'bg-gray-200 text-gray-400 border-gray-200' : 'border-gray-300 text-gray-400'}`}>Pressure</button>
            </div>
            <WeatherChart dailyDataRaw={dailyDataRaw} selected={selected} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
