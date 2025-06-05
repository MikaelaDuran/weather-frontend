/*import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';

const data = [
  { time: '00:00', temperature: 19, humidity: 15, pressure: 10 },
  { time: '06:00', temperature: 20, humidity: 14, pressure: 10 },
  { time: '12:00', temperature: 25, humidity: 12, pressure: 11 },
  { time: '15:00', temperature: 23, humidity: 13, pressure: 13 },
  { time: '18:00', temperature: 21, humidity: 14, pressure: 14 },
  { time: '21:00', temperature: 18, humidity: 15, pressure: 15 },
];

export default function WeatherChart() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#d4af37]">
        Changes Over Time
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" stroke="#d4af37" />
          <YAxis stroke="#d4af37" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#ef4444"
            strokeWidth={3}
            name="Temperature"
          />
          <Line
            type="monotone"
            dataKey="humidity"
            stroke="#3b82f6"
            strokeWidth={3}
            name="Humidity"
          />
          <Line
            type="monotone"
            dataKey="pressure"
            stroke="#a3a3a3"
            strokeWidth={3}
            name="Pressure"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}*/
