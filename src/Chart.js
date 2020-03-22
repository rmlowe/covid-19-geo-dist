import React from 'react';
import { ResponsiveContainer, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area } from 'recharts';

import { casesReducer, reduceByKey } from './util';

const Chart = props => {
  const byDate = Object.values(reduceByKey(props.data, 'date', casesReducer));
  byDate.sort((a, b) => a.dateNumber - b.dateNumber);

  return (
    <ResponsiveContainer width="100%" height={150}>
      <AreaChart data={byDate} margin={{ top: 20 }}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="dateString" hide={true} />
        <YAxis />
        <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Area name="New confirmed cases" type="monotone" dataKey="newCases" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
        <Area name="Deaths" type="monotone" dataKey="deaths" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default Chart;