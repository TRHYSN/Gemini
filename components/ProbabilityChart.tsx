import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

interface Props {
  confidence: number;
}

const ProbabilityChart: React.FC<Props> = ({ confidence }) => {
  const data = [
    { name: '审计置信度', value: confidence * 100, color: '#06b6d4' },
  ];

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={14} width={100} tick={{fill: '#94a3b8', fontWeight: 'bold'}} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
            itemStyle={{ color: '#fff' }}
            cursor={{fill: 'transparent'}}
            formatter={(value: number) => [`${value.toFixed(1)}%`, 'Score']}
          />
          <ReferenceLine x={80} stroke="#f43f5e" strokeDasharray="3 3" />
          <Bar dataKey="value" barSize={30} radius={[0, 6, 6, 0]}>
            <Cell fill={confidence > 0.8 ? '#10b981' : confidence > 0.5 ? '#f59e0b' : '#ef4444'} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProbabilityChart;
