import React from 'react';
import { ResponsiveContainer, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area } from 'recharts';

import { casesReducer, reduceByKey, nextDate } from './util';

const datesInRange = ({ startDate, endDate }, interval) => {
  const result = [];
  let currentDate = startDate;
  while (currentDate <= endDate) {
    result.push(currentDate);
    currentDate = nextDate(currentDate, interval);
  }
  return result;
}

const Chart = props => {
  const byDate = reduceByKey(props.data, 'date', casesReducer);
  const data = datesInRange(props.dateRange, props.interval)
    .map(date => byDate[date] || { dateString: date.toLocaleDateString(), newCases: 0, deaths: 0 })
    .map(date => ({
      dateString: date.dateString,
      newCases: date.newCases / props.denominator,
      deaths: date.deaths / props.denominator
    }));

  return (
    <ResponsiveContainer width="100%" height={150}>
      <AreaChart data={data} margin={{ top: 20 }}>
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