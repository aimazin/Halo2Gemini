
import React, { useMemo } from 'react';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, ReferenceDot } from 'recharts';
import type { HistoricalPrice } from '../types';

interface PriceChartProps {
  historicalData: HistoricalPrice[];
  prediction: number | null;
  assetName: string;
}

export const PriceChart: React.FC<PriceChartProps> = ({ historicalData, prediction, assetName }) => {

  const chartData = useMemo(() => {
    const data = historicalData.map(item => ({
      date: item.date,
      Open: item.open,
      Close: item.close,
    }));

    if (prediction !== null) {
      // Add prediction as a new data point
      data.push({
        date: 'Prediction',
        // Carry forward last close for a smoother line
        Close: data[data.length - 1].Close,
        Prediction: prediction,
      });
    }
    return data;
  }, [historicalData, prediction]);

  const domainPadding = useMemo(() => {
    const allValues = historicalData.flatMap(d => [d.open, d.close]);
    if (prediction) allValues.push(prediction);
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const padding = (max - min) * 0.1; // 10% padding
    return [min - padding, max + padding];
  }, [historicalData, prediction]);
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
        <XAxis dataKey="date" stroke="#A0AEC0" />
        <YAxis 
          stroke="#A0AEC0" 
          domain={domainPadding}
          tickFormatter={(tick) => {
            if (tick >= 1000) return `${(tick / 1000).toFixed(1)}k`;
            return tick.toFixed(2);
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(31, 41, 55, 0.8)',
            borderColor: '#4A5568',
            color: '#E5E7EB',
          }}
          labelStyle={{ color: '#9CA3AF' }}
        />
        <Legend wrapperStyle={{ color: '#E5E7EB' }} />
        <Line type="monotone" dataKey="Open" stroke="#4FD1C5" strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="Close" stroke="#63B3ED" strokeWidth={2} dot={{ r: 3 }} />
        {prediction !== null && (
          <Line type="monotone" dataKey="Prediction" stroke="#F6E05E" strokeWidth={2} strokeDasharray="5 5" legendType="none">
             { chartData.map((entry, index) => 
                entry.Prediction ? <ReferenceDot key={index} x={entry.date} y={entry.Prediction} r={6} fill="#F6E05E" stroke="white" strokeWidth={2}/> : null
             )}
          </Line>
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};
