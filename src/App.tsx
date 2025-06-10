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
    const interval = setInterval(fetchWeather, 60000); // varje minut
    return () => clearInterval(interval);
  }, []);

  const staticLabels = Array.from({ length: 13 }, (_, i) => {
    const hour = i * 2;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const dataByLabel = staticLabels.map((label) => {
    const [targetHour] = label.split(':').map(Number);
    const matching = dailyData.filter(d => {
      const ts = new Date(d.timestamp ?? '');
      return ts.getHours() === targetHour;
    });
    const latest = matching[matching.length - 1];
    return latest ?? null;
  });

  const chartData = {
    labels: staticLabels,
    datasets: [
      selected === 'temp' && {
        label: 'Temperature (°C)',
        data: dataByLabel.map(d => d?.temp ?? null),
        borderColor: '#4b5563',
        tension: 0.4
      },
      selected === 'humidity' && {
        label: 'Humidity (%)',
        data: dataByLabel.map(d => d?.humidity ?? null),
        borderColor: '#4b5563',
        tension: 0.4
      },
      selected === 'pressure' && {
        label: 'Pressure (hPa)',
        data: dataByLabel.map(d => d?.pressure ?? null),
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
    x: {
      title: { display: false },
      ticks: {
        autoSkip: false,
        maxRotation: 0,
        minRotation: 0
      },
      grid: {
        display: false // Tar bort vertikala linjer
      }
    },
    y: {
      title: { display: false },
      min: selected === 'temp' ? -40 : undefined,
      max: selected === 'temp' ? 50 : undefined,
      grid: {
        display: false // Tar bort horisontella linjer
      }
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
          <h2 className="text-3xl font-playfair text-slate-700 text-center mb-2">Today</h2>
          <p className="text-center text-slate-600 mb-6">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            })}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
