import { useEffect, useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip
} from 'chart.js';
import type { ChartOptions } from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip);

interface Weather {
  id: number;
  temp: number;
  pressure: number;
  humidity: number;
  timestamp?: string;
}

function App() {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [dailyData, setDailyData] = useState<Weather[]>([]);
  const [selected, setSelected] = useState<'temp' | 'humidity' | 'pressure'>('temp');

  useEffect(() => {
    const fetchWeather = () => {
      fetch('http://localhost:8080/weather/all')
        .then((res) => res.json())
        .then((data: Weather[]) => {
          if (data.length > 0) {
            setWeather(data[0]);

            const today = new Date().toISOString().split('T')[0];
            const filtered = data.filter(entry => {
              const entryDate = new Date(entry.timestamp ?? '').toISOString().split('T')[0];
              return entryDate === today;
            });

            setDailyData(filtered);
          }
        })
        .catch((err) => console.error('Failed to fetch weather data:', err));
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 3600000);
    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: dailyData.map((d) =>
      new Date(d.timestamp ?? '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    ),
    datasets: [
      selected === 'temp' && {
        label: 'Temperature (°C)',
        data: dailyData.map(d => d.temp),
        borderColor: '#4b5563',
        tension: 0.4
      },
      selected === 'humidity' && {
        label: 'Humidity (%)',
        data: dailyData.map(d => d.humidity),
        borderColor: '#4b5563',
        tension: 0.4
      },
      selected === 'pressure' && {
        label: 'Pressure (hPa)',
        data: dailyData.map(d => d.pressure),
        borderColor: '#4b5563',
        tension: 0.4
      }
    ].filter(Boolean) as any
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' }
    },
    scales: {
      x: { title: { display: false } },
      y: {
        title: { display: false },
        min: selected === 'temp' ? -40 : undefined,
        max: selected === 'temp' ? 50 : undefined
      }
    }
  };

  const card = (title: string, value: string) => (
    <div className="bg-white shadow rounded-xl p-4 text-center">
      <p className="text-gray-600 text-sm">{title}</p>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-tr from-white via-white to-sky-100 text-black flex items-center justify-center px-4 py-6">
        
        <div className="w-full max-w-4xl bg-white/60 rounded-2xl shadow-2xl p-6 mt-12">
        

          {/* Enkel Today-rubrik och datum */}
          <h2 className="text-3xl font-playfair text-slate-700 text-center mb-2">
            Today
          </h2>
          <p className="text-center text-slate-600 mb-6">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>

          {/* Weather cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {card('Temperature', weather ? `${weather.temp} °C` : '--')}
            {card('Humidity', weather ? `${weather.humidity} %` : '--')}
            {card('Pressure', weather ? `${weather.pressure} hPa` : '--')}
          </div>

          {/* Chart section */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-center gap-4 mb-4">
              <button
                onClick={() => setSelected('temp')}
                className={`px-4 py-1 rounded-full border ${
                  selected === 'temp' ? 'bg-gray-200 text-gray-400 border-gray-200' : 'border-gray-300 text-gray-400'
                }`}
              >
                Temperature
              </button>
              <button
                onClick={() => setSelected('humidity')}
                className={`px-4 py-1 rounded-full border ${
                  selected === 'humidity' ? 'bg-gray-200 text-gray-400 border-gray-200' : 'border-gray-300 text-gray-400'
                }`}
              >
                Humidity
              </button>
              <button
                onClick={() => setSelected('pressure')}
                className={`px-4 py-1 rounded-full border ${
                  selected === 'pressure' ? 'bg-gray-200 text-gray-400 border-gray-200' : 'border-gray-300 text-gray-400'
                }`}
              >
                Pressure
              </button>
            </div>

            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
