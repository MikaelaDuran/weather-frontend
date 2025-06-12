// ...
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
  const { filledData, labels, yMin, yMax, stepSize } = useMemo(() => {
    const cleanedMap = new Map<string, Weather>();
    for (const entry of dailyDataRaw) {
      const date = new Date(entry.timestamp ?? '');
      const rounded = date.toTimeString().substring(0, 5);
      cleanedMap.set(rounded, entry);
    }

    const cleanedList: CleanedWeather[] = Array.from(cleanedMap.entries()).map(([time, entry]) => ({
      roundedTime: time,
      temp: entry.temp,
      humidity: entry.humidity,
      pressure: entry.pressure
    }));

    cleanedList.sort((a, b) => a.roundedTime.localeCompare(b.roundedTime));

    const allTimes: string[] = [];
    if (cleanedList.length > 0) {
      const first = new Date(`1970-01-01T${cleanedList[0].roundedTime}:00`);
      const last = new Date(`1970-01-01T${cleanedList[cleanedList.length - 1].roundedTime}:00`);

      const start = new Date(first);
      const end = new Date(last);

      if (start.getMinutes() > 30) start.setHours(start.getHours() + 1, 0, 0, 0);
      else if (start.getMinutes() > 0) start.setMinutes(30, 0, 0);

      if (end.getMinutes() > 30) end.setHours(end.getHours() + 1, 0, 0, 0);
      else if (end.getMinutes() > 0) end.setMinutes(30, 0, 0);

      const current = new Date(start);
      while (current <= end) {
        allTimes.push(current.toTimeString().substring(0, 5));
        current.setMinutes(current.getMinutes() + 1);
      }
    }

    const dataMap = new Map(cleanedList.map(e => [e.roundedTime, e]));
    const filledData = allTimes.map(t => dataMap.get(t) ?? {
      roundedTime: t,
      temp: null,
      humidity: null,
      pressure: null
    });

    const values = filledData.map(e => {
      if (selected === 'temp') return e.temp;
      if (selected === 'humidity') return e.humidity;
      if (selected === 'pressure') return e.pressure;
      return null;
    }).filter((v): v is number => v !== null);

    let yMin = 0;
    let yMax = 100;
    let stepSize = 5;

    if (values.length > 0) {
      const min = Math.min(...values);
      const max = Math.max(...values);

      if (selected === 'temp') {
        const center = Math.round((min + max) / 2);
        yMin = Math.floor((center - 10) / 2) * 2;
        yMax = Math.ceil((center + 10) / 2) * 2;
        stepSize = 2;
      } else if (selected === 'humidity') {
        yMin = Math.max(0, Math.floor((min - 10) / 5) * 5);
        yMax = Math.min(100, Math.ceil((max + 10) / 5) * 5);
        stepSize = 5;
      } else if (selected === 'pressure') {
        yMin = Math.floor((min - 100) / 10) * 10;
        yMax = Math.ceil((max + 100) / 10) * 10;
        stepSize = 20;
      }
    }

    return { filledData, labels: allTimes, yMin, yMax, stepSize };
  }, [dailyDataRaw, selected]);

  const chartData = {
    labels,
    datasets: [
      {
        label: selected === 'temp' ? 'Temperature (°C)' :
               selected === 'humidity' ? 'Humidity (%)' : 'Pressure (hPa)',
        data: filledData.map(d => selected === 'temp' ? d.temp :
                                  selected === 'humidity' ? d.humidity :
                                  d.pressure),
        borderColor: '#4b5563',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        tension: 0.4,
        spanGaps: true
      }
    ]
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
        min: yMin,
        max: yMax,
        ticks: {
          stepSize: stepSize
        },
        grid: { display: false }
      }
    }
  };

  return <Line data={chartData} options={chartOptions} />;
};

export default WeatherChart;
