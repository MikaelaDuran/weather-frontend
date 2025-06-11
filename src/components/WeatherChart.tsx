import { Line } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip
} from 'chart.js';

import { useMemo } from 'react';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip);

interface Weather {
  id: number;
  temp: number;
  pressure: number;
  humidity: number;
  timestamp?: string;
}

interface CleanedWeather {
  roundedTime: string;
  temp: number | null;
  humidity: number | null;
  pressure: number | null;
}

interface Props {
  dailyDataRaw: Weather[];
  selected: 'temp' | 'humidity' | 'pressure';
}

const WeatherChart = ({ dailyDataRaw, selected }: Props) => {
  const { filledData, labels } = useMemo(() => {
    const cleanedDataMap = new Map<string, Weather>();
    for (const entry of dailyDataRaw) {
      const date = new Date(entry.timestamp ?? '');
      const rounded = date.toTimeString().substring(0, 5);
      cleanedDataMap.set(rounded, entry); // senaste vinner
    }

    const sortedEntries: CleanedWeather[] = Array.from(cleanedDataMap.entries()).map(([minute, entry]) => ({
      roundedTime: minute,
      temp: entry.temp,
      humidity: entry.humidity,
      pressure: entry.pressure
    }));

    sortedEntries.sort((a, b) => a.roundedTime.localeCompare(b.roundedTime));

    if (sortedEntries.length > 0) {
      const firstTime = new Date(`1970-01-01T${sortedEntries[0].roundedTime}:00`);
      const lastTime = new Date(`1970-01-01T${sortedEntries[sortedEntries.length - 1].roundedTime}:00`);

      // Runda UPP till närmaste halvtimme efter första tidpunkten
      const startTime = new Date(firstTime);
      const startMin = startTime.getMinutes();
      if (startMin > 30) {
        startTime.setHours(startTime.getHours() + 1, 0, 0, 0);
      } else if (startMin > 0) {
        startTime.setMinutes(30, 0, 0);
      }

      // Runda UPP till närmaste halvtimme efter sista tidpunkten
      const endTime = new Date(lastTime);
      const endMin = endTime.getMinutes();
      if (endMin > 30) {
        endTime.setHours(endTime.getHours() + 1, 0, 0, 0);
      } else if (endMin > 0) {
        endTime.setMinutes(30, 0, 0);
      }

      const allTimes: string[] = [];
      const current = new Date(startTime);
      while (current <= endTime) {
        const hh = current.getHours().toString().padStart(2, '0');
        const mm = current.getMinutes().toString().padStart(2, '0');
        allTimes.push(`${hh}:${mm}`);
        current.setMinutes(current.getMinutes() + 1);
      }

      const dataMap = new Map(sortedEntries.map(d => [d.roundedTime, d]));
      const filledData: CleanedWeather[] = allTimes.map(time => {
        return dataMap.get(time) || {
          roundedTime: time,
          temp: null,
          humidity: null,
          pressure: null
        };
      });

      return { filledData, labels: allTimes };
    }

    return { filledData: [], labels: [] };
  }, [dailyDataRaw]);

  const chartData = {
    labels,
    datasets: [
      selected === 'temp' && {
        label: 'Temperature (°C)',
        data: filledData.map(d => d.temp),
        borderColor: '#4b5563',
        tension: 0.4,
        spanGaps: true
      },
      selected === 'humidity' && {
        label: 'Humidity (%)',
        data: filledData.map(d => d.humidity),
        borderColor: '#4b5563',
        tension: 0.4,
        spanGaps: true
      },
      selected === 'pressure' && {
        label: 'Pressure (hPa)',
        data: filledData.map(d => d.pressure),
        borderColor: '#4b5563',
        tension: 0.4,
        spanGaps: true
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
        ticks: {
          autoSkip: false,
          callback: (_value, index) => {
            const label = labels[index];
            return label?.endsWith(':00') || label?.endsWith(':30') ? label : '';
          },
          maxRotation: 0,
          minRotation: 0
        },
        grid: { display: false }
      },
      y: {
        title: { display: false },
        min: selected === 'temp' ? -40 : undefined,
        max: selected === 'temp' ? 50 : undefined,
        grid: { display: false }
      }
    }
  };

  return <Line data={chartData} options={chartOptions} />;
};

export default WeatherChart;
