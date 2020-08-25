import React from 'react';
import { ResponsiveContainer, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area } from 'recharts';

import { casesReducer, reduceByKey } from './util';

const nextDate = date => {
  const result = new Date(date);
  result.setDate(date.getDate() + 1);
  return result;
}

const datesInRange = ({ startDate, endDate }) => {
  const result = [];
  let currentDate = startDate;
  while (currentDate <= endDate) {
    result.push(currentDate);
    currentDate = nextDate(currentDate);
  }
  return result;
}

const Chart = props => {
  const byDate = reduceByKey(props.data, 'date', casesReducer);
  const data = datesInRange(props.dateRange)
    .map(date => byDate[date] || { date, dateString: date.toLocaleDateString(), newCases: 0, deaths: 0 })
    .map(date => ({
      date: date.date,
      dateString: date.dateString,
      newCases: date.newCases / props.denominator,
      deaths: date.deaths / props.denominator
    }));

  const weekdays = {};
  data.forEach(record => {
    const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(record.date);
    const [sum, count] = weekdays[weekday] || [0, 0];
    weekdays[weekday] = [sum + record.newCases, count + 1];
  });
  for (const [weekday, [sum, count]] of Object.entries(weekdays)) {
    console.log(`${weekday}: ${sum / count}`);
  }

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