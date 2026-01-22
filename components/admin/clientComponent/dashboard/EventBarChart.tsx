'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  data: any;
}

export default function EventBarChart({ data }: Props) {
  // Data mein 'path' property add ki gayi hai 🧩
  const chartData = (data?.events || []).map((row: any) => ({
    name: row.dimensionValues?.[0]?.value.replace(/_/g, ' '),
    path: row.dimensionValues?.[1]?.value, // Tooltip ke liye path store kiya
    count: parseInt(row.metricValues?.[0]?.value || '0'),
  })).slice(0, 10); 

  const COLORS = ['#F97316', '#FB923C', '#FDBA74', '#FED7AA', '#FFEDD5'];

  return (
    <div className="h-[350px] w-full mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 30 }}>
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={120} 
            tick={{ fontSize: 10, fill: '#64748b' }}
          />
          {/* Custom Tooltip jo 'path' bhi dikhayega */}
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 shadow-lg border border-gray-100 rounded-lg text-[10px]">
                    <p className="font-bold text-gray-800 uppercase">{payload[0].payload.name}</p>
                    <p className="text-blue-500 font-mono mt-1">{payload[0].payload.path}</p>
                    <p className="text-gray-400 mt-1">Occurrences: <span className="text-orange-500 font-bold">{payload[0].value}</span></p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
            {chartData.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}